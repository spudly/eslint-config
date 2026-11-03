import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {base} from '../dist/index.js';

const linter = new Linter();

function ruleIds(code, filename) {
  const messages = linter.verify(code, [...base], {filename});
  return messages.map(m => m.ruleId);
}

// A single function well past the 30-line max-lines-per-function limit.
const longFunction = [
  'export function demo() {',
  ...Array.from({length: 40}, (_, i) => `  const v${i} = ${i};`),
  '  return 0;',
  '}',
  '',
].join('\n');

// A file well past the 150-line max-lines limit.
const longFile = [
  ...Array.from({length: 160}, (_, i) => `export const value${i} = ${i};`),
  '',
].join('\n');

const testFiles = [
  'src/example.test.ts',
  'src/example.test.tsx',
  'src/example.spec.ts',
  'src/__tests__/example.ts',
  'jest.setup.ts',
  'jest.env.ts',
  'jest.setupEnv.ts',
];

test('base: test files are exempt from max-lines-per-function (issue #29)', () => {
  for (const filename of testFiles) {
    const ids = ruleIds(longFunction, filename);
    assert.ok(
      !ids.includes('max-lines-per-function'),
      `${filename} should be exempt, got: ${ids.join(', ')}`,
    );
  }
});

test('base: test files are exempt from max-lines (issue #29)', () => {
  for (const filename of testFiles) {
    const ids = ruleIds(longFile, filename);
    assert.ok(
      !ids.includes('max-lines'),
      `${filename} should be exempt, got: ${ids.join(', ')}`,
    );
  }
});

test('base: non-test files keep both line-count limits (issue #29)', () => {
  const fnIds = ruleIds(longFunction, 'src/example.ts');
  assert.ok(
    fnIds.includes('max-lines-per-function'),
    `non-test file should still report max-lines-per-function, got: ${fnIds.join(', ')}`,
  );
  const fileIds = ruleIds(longFile, 'src/example.ts');
  assert.ok(
    fileIds.includes('max-lines'),
    `non-test file should still report max-lines, got: ${fileIds.join(', ')}`,
  );
});
