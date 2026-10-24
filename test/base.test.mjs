import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {base, commonjsOverrides, importX, unicorn} from '../dist/index.js';

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

test('base + importX + unicorn compose and fire together', () => {
  const code = "const x = require('node:fs');\nconsole.log(x);\n";
  const ids = ruleIds(code, [...base, ...importX, ...unicorn], 'x.js');
  assert.ok(ids.includes('no-console'), `got: ${ids.join(', ')}`);
  assert.ok(ids.includes('import-x/no-commonjs'), `got: ${ids.join(', ')}`);
});

test('commonjsOverrides turns the CJS bans off for .cjs files', () => {
  const code = "const x = require('node:fs');\nmodule.exports = x;\n";
  const config = [...base, ...importX, ...unicorn, ...commonjsOverrides];
  const ids = ruleIds(code, config, 'x.cjs');
  assert.ok(!ids.includes('import-x/no-commonjs'), `got: ${ids.join(', ')}`);
  assert.ok(!ids.includes('unicorn/prefer-module'), `got: ${ids.join(', ')}`);
});
