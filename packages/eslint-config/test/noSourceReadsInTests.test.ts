import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';
import type {ESLint, Linter as LinterTypes} from 'eslint';

import {jest} from '../dist/index.js';
import noSourceReadsInTestsPlugin from '../dist/no-source-reads-in-tests-plugin.js';

// Behavior tests for the ported no-source-reads-in-tests rule
// (issue #59), carried over from the design-system's
// noSourceReadsInTests test (design-system #733/#772): test files
// must not read JS/TS source files — source-string pins protect
// spelling, not behavior.
//
// Driven through ESLint's Linter on plain-JS snippets: the default
// parser cannot parse TypeScript syntax, but the rule operates
// purely on call expressions and string literals, so JS snippets
// exercise it fully.
const linter = new Linter();

const testConfig: LinterTypes.Config[] = [
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    plugins: {
      'no-source-reads-in-tests':
        noSourceReadsInTestsPlugin as unknown as ESLint.Plugin,
    },
    languageOptions: {
      parserOptions: {ecmaVersion: 2022, sourceType: 'module'},
    },
    rules: {
      'no-source-reads-in-tests/no-source-reads-in-tests': 'warn',
    },
  },
];

function messageIds(code: string): (string | undefined)[] {
  return linter
    .verify(code, testConfig, {filename: 'src/widgets/Example.test.ts'})
    .map(message => message.messageId);
}

test('no-source-reads-in-tests: direct source reads are flagged', () => {
  assert.deepEqual(
    messageIds(`readFileSync("src/widgets/Badge.tsx", "utf8");`),
    ['sourceRead'],
  );
  assert.deepEqual(
    messageIds(`readFileSync(join(root, "src", "pages", "index.ts"), "utf8");`),
    ['sourceRead'],
  );
  assert.deepEqual(
    messageIds('readFileSync(join(here, `${name}.tsx`), "utf8");'),
    ['sourceRead'],
  );
  assert.deepEqual(
    messageIds(`fs.readFileSync("src/views/index.ts", "utf8");`),
    ['sourceRead'],
  );
  assert.deepEqual(messageIds(`existsSync("src/widgets/Retired.tsx");`), [
    'sourceRead',
  ]);
});

test('no-source-reads-in-tests: variable-held source paths are flagged', () => {
  const code = [
    `const path = join(root, "src/widgets/Badge.tsx");`,
    `const src = readFileSync(path, "utf8");`,
  ].join('\n');
  assert.deepEqual(messageIds(code), ['sourceRead']);
});

test('no-source-reads-in-tests: enumerate-then-read over a source directory is flagged', () => {
  const code = [
    `const files = readdirSync(join(root, "src", "widgets"));`,
    `for (const file of files) { readFileSync(join(dir, file), "utf8"); }`,
  ].join('\n');
  assert.deepEqual(messageIds(code), [
    'dynamicSourceRead',
    'dynamicSourceRead',
  ]);
});

test('no-source-reads-in-tests: source-read helper call sites are flagged where the path is known', () => {
  const code = [
    `function readCode(rel) { return readFileSync(join(root, rel), "utf8"); }`,
    `const pages = [["Badge", "src/widgets/Badge.tsx"]];`,
    `for (const [name, rel] of pages) { const code = readCode(rel); }`,
    `const pkg = readCode("package.json");`,
  ].join('\n');
  assert.deepEqual(messageIds(code), ['dynamicSourceRead']);
});

test('no-source-reads-in-tests: legitimate reads are not flagged: dist output, declarations, data files', () => {
  assert.deepEqual(
    messageIds(
      `readFileSync(join(here, "../..", "dist", "widgets", "index.d.ts"), "utf8");`,
    ),
    [],
  );
  assert.deepEqual(
    messageIds(`readFileSync(join(root, "src/widgets/index.d.ts"), "utf8");`),
    [],
  );
  assert.deepEqual(messageIds(`readFileSync("package.json", "utf8");`), []);
  assert.deepEqual(
    messageIds(`readFileSync(join(here, "baseline.json"), "utf8");`),
    [],
  );
  assert.deepEqual(
    messageIds(
      `readFileSync(join(here, ".storybook", "preview-head.html"), "utf8");`,
    ),
    [],
  );
  assert.deepEqual(
    messageIds(`readFileSync(join(root, "docs", "manual-tests.md"), "utf8");`),
    [],
  );
});

test('no-source-reads-in-tests: non-read calls and reads of runtime values are untouched', () => {
  assert.deepEqual(
    messageIds(`writeFileSync("src/widgets/Badge.tsx", "x");`),
    [],
  );
  assert.deepEqual(messageIds(`readFileSync(0, "utf8");`), []);
  assert.deepEqual(messageIds(`const text = readFileSync(file, "utf8");`), []);
});

test('no-source-reads-in-tests: shipped jest export registers the rule at warn for test files', () => {
  const blocks = jest.filter(
    block =>
      block.rules &&
      'no-source-reads-in-tests/no-source-reads-in-tests' in block.rules,
  );
  assert.equal(blocks.length, 1);
  const [block] = blocks;
  assert.ok(block);
  assert.equal(
    block.rules?.['no-source-reads-in-tests/no-source-reads-in-tests'],
    'warn',
  );
  assert.ok(block.plugins?.['no-source-reads-in-tests']);
  assert.ok((block.files ?? []).some(glob => glob.includes('*.test.')));
  // And it fires through the shipped jest export on a test file.
  const messages = linter.verify(
    `readFileSync("src/widgets/Badge.tsx", "utf8");`,
    // Jest version pinned via settings, as in other.test.ts (consumers
    // with jest installed get auto-detection).
    [...jest, {settings: {jest: {version: 30}}}] as LinterTypes.Config[],
    {filename: 'fixture.test.ts'},
  );
  assert.ok(
    messages.some(
      m =>
        m.ruleId === 'no-source-reads-in-tests/no-source-reads-in-tests' &&
        m.messageId === 'sourceRead',
    ),
  );
});
