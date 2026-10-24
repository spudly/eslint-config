import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdtemp, readdir, rm, writeFile} from 'node:fs/promises';
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

// TS7 consumer fixture (issue #8). This package's own suite runs on
// TypeScript ^5.9, so it cannot see load-time crashes that only happen
// when a consumer's resolvable `typescript` is 7.x — how the `react`
// export shipped broken in 0.1.0 (eslint-plugin-react-x imports
// ts-api-utils, which reads ts.TypeFlags at init; TS7 has none). This
// test packs the real tarball, installs it into a scratch consumer
// next to typescript@^7 + eslint@^10, and asserts every export
// consumers compose today loads there and lints a trivial sample. The
// pending export is probed as a tripwire: while upstream is
// incompatible it must NOT load, and the day it loads this test goes
// red with the restoration steps — the restore signal, mirroring the
// typescriptPendingIgnores watch. See src/react-pending.ts.
const RUNNER = `
import ts from 'typescript';
console.log('TS_VERSION', ts.version);
const root = await import('@spudly/eslint-config');
console.log('ROOT_KEYS', Object.keys(root).sort().join(','));
for (const sub of ['base','react','react-native','jest','node','tailwind','typescript']) {
  await import('@spudly/eslint-config/' + sub);
  console.log('SUBPATH_OK', sub);
}
const {Linter} = await import('eslint');
const linter = new Linter();
const lang = {languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}, sourceType: 'module'}};
const hook = \`import {useState} from 'react';
export const C = ({flag}) => { if (flag) { useState(0); } return null; };
\`;
const composed = [lang, ...root.typescriptPendingIgnores, ...root.base, ...root.react,
  ...root.reactNative, ...root.node.map(b => ({...b, files: ['server/**']})), ...root.jest, ...root.tailwind];
const messages = linter.verify(hook, composed, {filename: 'Comp.jsx'});
console.log('FATAL_COUNT', messages.filter(m => m.fatal).length);
console.log('RULE_IDS', [...new Set(messages.map(m => m.ruleId))].sort().join(','));
try {
  const p = await import('@spudly/eslint-config/react-pending');
  console.log('PENDING_LOADED', Array.isArray(p.default ?? p.reactPending));
} catch (error) {
  console.log('PENDING_BLOCKED', String(error && error.message).split('\\n')[0]);
}
`;

async function packAndInstall(scratch) {
  await run(
    'npm',
    ['pack', '--pack-destination', scratch, '--loglevel=error'],
    {
      cwd: repoRoot,
    },
  );
  const entries = await readdir(scratch);
  const packed = entries.find(f => f.endsWith('.tgz'));
  assert.ok(packed, 'npm pack produced no tarball');
  const consumer = path.join(scratch, 'consumer');
  await run('mkdir', [consumer]);
  await writeFile(
    path.join(consumer, 'package.json'),
    JSON.stringify({
      name: 'ts7-consumer-fixture',
      private: true,
      type: 'module',
    }),
  );
  await installDeps(consumer, path.join(scratch, packed));
  await writeFile(path.join(consumer, 'runner.mjs'), RUNNER);
  return consumer;
}

async function installDeps(consumer, tarball) {
  await run(
    'npm',
    [
      'install',
      '--no-audit',
      '--no-fund',
      '--ignore-scripts',
      '--loglevel=error',
      `file:${tarball}`,
      'eslint@^10.0.0',
      'typescript@^7.0.2',
    ],
    {cwd: consumer, timeout: 600_000},
  );
}

function outputLine(stdout, prefix) {
  return stdout
    .split('\n')
    .find(l => l.startsWith(prefix))
    ?.slice(prefix.length + 1);
}

function assertConsumerOutput(stdout) {
  const line = prefix => outputLine(stdout, prefix);
  assert.match(
    line('TS_VERSION') ?? '',
    /^7\./,
    'fixture must resolve TypeScript 7',
  );
  for (const sub of SUBPATHS) {
    assert.ok(
      stdout.includes(`SUBPATH_OK ${sub}`),
      `subpath '${sub}' did not load`,
    );
  }
  assert.equal(
    line('FATAL_COUNT'),
    '0',
    `fatal lint errors under TS7:\n${stdout}`,
  );
  assert.ok(
    (line('RULE_IDS') ?? '').split(',').includes('react-hooks/rules-of-hooks'),
    `react must lint under TS7 (rules-of-hooks fires):\n${stdout}`,
  );
  assertPendingTripwire(stdout);
}

// Tripwire (issue #8): reactPending stays unloadable under TS7 until
// upstream's ts-api-utils chain is TS7-compatible. When this fails
// because PENDING_LOADED appeared, the restore condition is met: fold
// reactPending back into `react`, delete the pending export, and
// update this expectation.
function assertPendingTripwire(stdout) {
  assert.ok(
    stdout.includes('PENDING_BLOCKED'),
    `reactPending loaded under TypeScript 7 — restoration condition for issue #8 is met.\n${stdout}`,
  );
}

test(
  'TS7 consumer: composed exports load and lint under typescript@7',
  {timeout: 600_000},
  async () => {
    const scratch = await mkdtemp(path.join(repoRoot, '.tmp-ts7-consumer-'));
    try {
      const consumer = await packAndInstall(scratch);
      const {stdout} = await run('node', ['runner.mjs'], {
        cwd: consumer,
        timeout: 120_000,
      });
      assertConsumerOutput(stdout);
    } finally {
      await rm(scratch, {recursive: true, force: true});
    }
  },
);
