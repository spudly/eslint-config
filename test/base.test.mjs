import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {base} from '../dist/index.js';

const linter = new Linter();

function ruleIds(code, config, filename) {
  const messages = linter.verify(code, config, {filename});
  return messages.map(m => m.ruleId);
}

test('base: no-console fires on a JS fixture', () => {
  const ids = ruleIds('console.log(1);\n', [...base], 'x.js');
  assert.ok(ids.includes('no-console'), `got: ${ids.join(', ')}`);
});

test('base: eqeqeq fires and a clean fixture stays clean', () => {
  const bad = ruleIds(
    'export const eq = (a, b) => a == b;\n',
    [...base],
    'x.js',
  );
  assert.ok(bad.includes('eqeqeq'), `got: ${bad.join(', ')}`);
  const good = ruleIds(
    'export const eq = (a, b) => a === b;\n',
    [...base],
    'x.js',
  );
  assert.ok(!good.includes('eqeqeq'));
  assert.ok(!good.includes('no-console'));
});

test('base: eslint-comments requires a reason on disables', () => {
  const code = '// eslint-disable-next-line no-console\nconsole.log(1);\n';
  const ids = ruleIds(code, [...base], 'x.js');
  assert.ok(
    ids.includes('eslint-comments/require-description'),
    `got: ${ids.join(', ')}`,
  );
  const withReason = ruleIds(
    '// eslint-disable-next-line no-console -- demo fixture\nconsole.log(1);\n',
    [...base],
    'x.js',
  );
  assert.ok(!withReason.includes('eslint-comments/require-description'));
});

// ─── Folded sections (Stephen, 2026-10-24) ────────────────────────────────
// importX, unicorn, commonjsOverrides, and coverageIgnore used to be
// separate exports; they now fold into `base`. These tests assert the
// folded base carries each section's rules — structurally (the rule is
// present in base's blocks) and behaviorally (it fires on a fixture).

function baseRuleIds() {
  const ids = new Set();
  for (const block of base) {
    for (const id of Object.keys(block.rules ?? {})) ids.add(id);
  }
  return ids;
}

test('base: folded sections are present in the resolved config', () => {
  const ids = baseRuleIds();
  assert.ok(ids.has('import-x/no-cycle'), 'import-x rules folded in');
  assert.ok(ids.has('unicorn/error-message'), 'unicorn rules folded in');
  assert.ok(
    ids.has('coverage-ignore/require-description'),
    'coverage-ignore rule folded in',
  );
  assert.ok(
    !ids.has('n/no-process-exit'),
    'node rules stay out of base (directory-scoped group)',
  );
  assert.ok(
    ![...ids].some(id => id.startsWith('spudly-ui/')),
    'no className rule in the package at all',
  );
});

test('base: import-x fires from base alone', () => {
  const code = "const x = require('node:fs');\nconsole.log(x);\n";
  const ids = ruleIds(code, [...base], 'x.js');
  assert.ok(ids.includes('no-console'), `got: ${ids.join(', ')}`);
  assert.ok(ids.includes('import-x/no-commonjs'), `got: ${ids.join(', ')}`);
});

test('base: unicorn fires from base alone', () => {
  const ids = ruleIds('throw new Error();\n', [...base], 'x.js');
  assert.ok(ids.includes('unicorn/error-message'), `got: ${ids.join(', ')}`);
});

test('base: coverage-ignore fires from base alone', () => {
  const code = '/* istanbul ignore next */\nconst x = 1;\nexport default x;\n';
  const ids = ruleIds(code, [...base], 'x.js');
  assert.ok(
    ids.includes('coverage-ignore/require-description'),
    `got: ${ids.join(', ')}`,
  );
});

test('base: CommonJS overrides turn the CJS bans off for .cjs files', () => {
  const code = "const x = require('node:fs');\nmodule.exports = x;\n";
  const ids = ruleIds(code, [...base], 'x.cjs');
  assert.ok(!ids.includes('import-x/no-commonjs'), `got: ${ids.join(', ')}`);
  assert.ok(!ids.includes('unicorn/prefer-module'), `got: ${ids.join(', ')}`);
});

test('base: node rules are NOT in base (server paths are consumer-side)', () => {
  const ids = ruleIds(
    'process.exit(1);\n',
    [...base],
    'packages/server/index.js',
  );
  assert.ok(!ids.includes('n/no-process-exit'), `got: ${ids.join(', ')}`);
});
