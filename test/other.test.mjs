import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {jest, node, typescriptPendingIgnores} from '../dist/index.js';

const linter = new Linter();

function messages(code, config, filename) {
  return linter.verify(code, config, {filename});
}

test('node: the export carries no files globs (paths are consumer-side)', () => {
  for (const block of node) {
    assert.ok(!('files' in block), 'node blocks must not bake in paths');
  }
});

// The documented consumer pattern: the repo attaches its own server
// directories to the rules-only node blocks.
const nodeForEciperay = node.map(block => ({
  ...block,
  files: ['packages/server/**', 'packages/mcp-server/**'],
}));

test('node: n/no-process-exit fires in a server file (consumer-mapped)', () => {
  const msgs = messages(
    'process.exit(1);\n',
    [...nodeForEciperay],
    'packages/server/index.js',
  );
  assert.ok(msgs.some(m => m.ruleId === 'n/no-process-exit'));
});

test('node: server rules do not apply outside the consumer paths', () => {
  const msgs = messages(
    'process.exit(1);\n',
    [...nodeForEciperay],
    'packages/app/index.js',
  );
  assert.ok(!msgs.some(m => m.ruleId === 'n/no-process-exit'));
});

test('jest: valid rules load and a focused test is flagged', () => {
  // This repo does not install jest itself, so the version is pinned via
  // settings (consumers with jest installed get auto-detection).
  const config = [...jest, {settings: {jest: {version: 30}}}];
  const code = "test.only('x', () => { expect(1).toBe(1); });\n";
  const msgs = messages(code, config, 'x.test.js');
  assert.ok(
    msgs.some(m => m.ruleId === 'jest/no-focused-tests'),
    `got: ${msgs.map(m => m.ruleId).join(', ')}`,
  );
  const clean = messages(
    "test('x', () => { expect(1).toBe(1); });\n",
    config,
    'x.test.js',
  );
  assert.ok(!clean.some(m => m.ruleId === 'jest/no-focused-tests'));
});

test('typescriptPendingIgnores: .ts files are not linted', () => {
  const config = [...typescriptPendingIgnores];
  const msgs = messages('console.log(1);\n', config, 'x.ts');
  assert.ok(
    msgs.every(m => m.severity !== 2),
    JSON.stringify(msgs),
  );
});
