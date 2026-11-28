import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdir, mkdtemp, readdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {test} from 'node:test';
import {promisify} from 'node:util';

const run = promisify(execFile);
const SUBPATHS = [
  'base',
  'react',
  'react-native',
  'jest',
  'node',
  'tailwind',
  'typescript',
];
const repoRoot = path.resolve(import.meta.dirname, '..');

// Side-by-side consumer fixture (issues #8 and #67). The shape under
// test (Stephen's 2026-11-24 / 2026-11-27 direction): the consumer's
// resolvable `typescript` IS @typescript/typescript6 for the lint
// runtime — typescript-eslint's `typescript <6.1.0` peer cap (and
// @eslint-react's ts-api-utils chain) is satisfied by TS 6 — while
// TypeScript 7 stays installed under the `typescript7` alias and
// compilation/typecheck runs its compiler by path. npm `overrides`
// cannot substitute a peer dependency (verified empirically for
// issue #8), so the top-level alias is the working shape.
//
// Until issue #67 this file also carried a plain-typescript@7
// consumer test. That shape is no longer installable at all: the
// restored `typescript` section makes typescript-eslint a dependency
// of this package, and its TS <6.1 peer conflicts with a consumer's
// plain typescript@7 (npm ERESOLVE). The side-by-side shape is now
// THE consumer setup for this package — the changeset and README
// flag that adoption step — so the plain-TS7 test was replaced by
// the side-by-side typescript proof below. The reactPending
// side-by-side proof is unchanged.

async function pack(scratch: string) {
  await run(
    'npm',
    ['pack', '--pack-destination', scratch, '--loglevel=error'],
    {cwd: repoRoot},
  );
  const entries = await readdir(scratch);
  const packed = entries.find(f => f.endsWith('.tgz'));
  assert.ok(packed, 'npm pack produced no tarball');
  return path.join(scratch, packed);
}

async function makeConsumer(scratch: string, name: string) {
  const consumer = path.join(scratch, 'consumer');
  await mkdir(consumer);
  await writeFile(
    path.join(consumer, 'package.json'),
    JSON.stringify({name, private: true, type: 'module'}),
  );
  return consumer;
}

async function installSideBySide(consumer: string, tarball: string) {
  const {stderr} = await run(
    'npm',
    [
      'install',
      '--no-audit',
      '--no-fund',
      '--ignore-scripts',
      '--loglevel=error',
      `file:${tarball}`,
      'eslint@^10.0.0',
      'typescript@npm:@typescript/typescript6@^6.0.2',
      'typescript7@npm:typescript@^7.0.2',
    ],
    {cwd: consumer, timeout: 600_000},
  );
  assert.ok(
    !/ERESOLVE|Could not resolve|peer dep|invalid:/i.test(stderr ?? ''),
    `side-by-side install must have no peer warnings:\n${stderr}`,
  );
}

function outputLine(stdout: string, prefix: string) {
  return stdout
    .split('\n')
    .find((l: string) => l.startsWith(prefix))
    ?.slice(prefix.length + 1);
}

// The typescript proof (issue #67): in the side-by-side shape the
// restored `typescript` section composes, ESLint lints real .ts and
// .tsx files on disk (projectService needs a real project), the
// type-aware signature rules fire, and the consumer's typecheck
// still runs the TypeScript 7 compiler from its alias.
const TYPESCRIPT_RUNNER = `
import ts from 'typescript';
console.log('TS_VERSION', ts.version);
const root = await import('@spudly/eslint-config');
console.log('ROOT_KEYS', Object.keys(root).sort().join(','));
for (const sub of ['base','react','react-native','jest','node','tailwind','typescript','react-pending']) {
  await import('@spudly/eslint-config/' + sub);
  console.log('SUBPATH_OK', sub);
}
const sub = await import('@spudly/eslint-config/typescript');
const section = sub.default ?? sub.typescript;
console.log('SECTION_IS_ARRAY', Array.isArray(section));
console.log('SECTION_HAS_PLUGIN', section.some(b => b.plugins && '@typescript-eslint' in b.plugins));
console.log('SECTION_FLOATING', JSON.stringify(section.flatMap(b => Object.entries(b.rules ?? {})).find(([k]) => k === '@typescript-eslint/no-floating-promises')?.[1] ?? null));
console.log('LEGACY_IGNORES_OK', Array.isArray(sub.typescriptPendingIgnores) && Array.isArray(root.typescriptPendingIgnores));
const {ESLint} = await import('eslint');
const eslint = new ESLint({overrideConfigFile: true, overrideConfig: [...section]});
const results = await eslint.lintFiles(['src/sample.ts', 'src/sample.tsx']);
for (const r of results) {
  console.log('FILE', r.filePath.split('/').pop(), 'FATAL', r.messages.filter(m => m.fatal).length, 'RULES', [...new Set(r.messages.map(m => m.ruleId))].sort().join(','));
}
`;

const SAMPLE_TS = `
export async function fetchValue(): Promise<number> {
  return 1;
}

export async function noAwait(): Promise<number> {
  return 1;
}

export function run(): void {
  fetchValue();
}
`;

const SAMPLE_TSX = `
export const anything: any = 1;
export const label = String(anything);
`;

test(
  'TS7 side-by-side consumer: restored typescript section lints TS/TSX with type-aware rules',
  {timeout: 600_000},
  async () => {
    const scratch = await mkdtemp(path.join(repoRoot, '.tmp-ts7-typescript-'));
    try {
      const tarball = await pack(scratch);
      const consumer = await makeConsumer(
        scratch,
        'ts7-side-by-side-typescript-fixture',
      );
      await installSideBySide(consumer, tarball);
      await writeFile(
        path.join(consumer, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            strict: true,
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            jsx: 'react-jsx',
            noEmit: true,
          },
          include: ['src'],
        }),
      );
      await mkdir(path.join(consumer, 'src'));
      await writeFile(path.join(consumer, 'src/sample.ts'), SAMPLE_TS);
      await writeFile(path.join(consumer, 'src/sample.tsx'), SAMPLE_TSX);
      await writeFile(path.join(consumer, 'runner.mjs'), TYPESCRIPT_RUNNER);
      const {stdout} = await run('node', ['runner.mjs'], {
        cwd: consumer,
        timeout: 120_000,
      });
      const line = (prefix: string) => outputLine(stdout, prefix);
      assert.match(
        line('TS_VERSION') ?? '',
        /^6\./,
        `lint runtime must resolve typescript6:\n${stdout}`,
      );
      for (const sub of [...SUBPATHS, 'react-pending']) {
        assert.ok(
          stdout.includes(`SUBPATH_OK ${sub}`),
          `subpath '${sub}' did not load in the side-by-side shape:\n${stdout}`,
        );
      }
      assert.equal(line('SECTION_IS_ARRAY'), 'true', stdout);
      assert.equal(line('SECTION_HAS_PLUGIN'), 'true', stdout);
      assert.equal(
        line('SECTION_FLOATING'),
        '"error"',
        `typescript section must carry the type-aware rules at their ported severities:\n${stdout}`,
      );
      assert.equal(line('LEGACY_IGNORES_OK'), 'true', stdout);
      const tsFile = stdout
        .split('\n')
        .find(l => l.startsWith('FILE sample.ts'));
      const tsxFile = stdout
        .split('\n')
        .find(l => l.startsWith('FILE sample.tsx'));
      assert.ok(tsFile?.includes('FATAL 0'), `sample.ts fatals:\n${stdout}`);
      assert.ok(
        tsFile?.includes('@typescript-eslint/no-floating-promises'),
        `type-aware no-floating-promises must fire on .ts:\n${stdout}`,
      );
      assert.ok(
        tsFile?.includes('@typescript-eslint/require-await'),
        `type-aware require-await must fire on .ts:\n${stdout}`,
      );
      assert.ok(tsxFile?.includes('FATAL 0'), `sample.tsx fatals:\n${stdout}`);
      assert.ok(
        tsxFile?.includes('@typescript-eslint/no-explicit-any'),
        `typescript rules must fire on .tsx:\n${stdout}`,
      );
      // Typecheck still runs the TypeScript 7 compiler by path: the
      // samples are type-correct (their problems are lint rules), so
      // the TS 7 compiler exits clean on them.
      const {stdout: tscVersion} = await run(
        'node',
        ['node_modules/typescript7/bin/tsc', '--version'],
        {cwd: consumer, timeout: 120_000},
      );
      assert.match(tscVersion, /Version 7\./);
      await run(
        'node',
        ['node_modules/typescript7/bin/tsc', '--noEmit', '-p', 'tsconfig.json'],
        {cwd: consumer, timeout: 120_000},
      );
    } finally {
      await rm(scratch, {recursive: true, force: true});
    }
  },
);

// Side-by-side consumer (issue #8, Stephen's 2026-11-24 direction):
// reactPending loads and its rules fire in the same shape, and the
// TS 7 compiler is still runnable via its alias bin.
const SIDE_BY_SIDE_RUNNER = `
import ts from 'typescript';
console.log('TS_VERSION', ts.version);
const pending = await import('@spudly/eslint-config/react-pending');
console.log('PENDING_LOADED', Array.isArray(pending.default ?? pending.reactPending));
const {Linter} = await import('eslint');
const linter = new Linter();
const lang = {languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}, sourceType: 'module'}};
const list = \`export const List = ({items}) => <ul>{items.map(i => <li>{i}</li>)}</ul>;
\`;
const messages = linter.verify(list, [lang, ...(pending.default ?? pending.reactPending)], {filename: 'List.jsx'});
console.log('PENDING_RULE_IDS', [...new Set(messages.map(m => m.ruleId))].sort().join(','));
`;

test(
  'TS7 side-by-side consumer: reactPending loads with typescript aliased to typescript6',
  {timeout: 600_000},
  async () => {
    const scratch = await mkdtemp(path.join(repoRoot, '.tmp-ts7-sidebyside-'));
    try {
      const tarball = await pack(scratch);
      const consumer = await makeConsumer(
        scratch,
        'ts7-side-by-side-consumer-fixture',
      );
      await installSideBySide(consumer, tarball);
      await writeFile(path.join(consumer, 'runner.mjs'), SIDE_BY_SIDE_RUNNER);
      const {stdout} = await run('node', ['runner.mjs'], {
        cwd: consumer,
        timeout: 120_000,
      });
      assert.match(
        outputLine(stdout, 'TS_VERSION') ?? '',
        /^6\./,
        `side-by-side fixture must resolve typescript6 for the lint runtime:\n${stdout}`,
      );
      assert.equal(
        outputLine(stdout, 'PENDING_LOADED'),
        'true',
        `reactPending must load in the side-by-side shape:\n${stdout}`,
      );
      assert.ok(
        (outputLine(stdout, 'PENDING_RULE_IDS') ?? '')
          .split(',')
          .includes('@eslint-react/no-missing-key'),
        `reactPending rules must fire in the side-by-side shape:\n${stdout}`,
      );
      const {stdout: tscVersion} = await run(
        'node',
        ['node_modules/typescript7/bin/tsc', '--version'],
        {cwd: consumer, timeout: 120_000},
      );
      assert.match(
        tscVersion,
        /Version 7\./,
        'TypeScript 7 compiler must stay runnable under the typescript7 alias',
      );
    } finally {
      await rm(scratch, {recursive: true, force: true});
    }
  },
);
