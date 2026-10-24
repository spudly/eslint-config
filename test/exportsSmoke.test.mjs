import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {URL} from 'node:url';

import {ESLint} from 'eslint';

// Consumer smoke (issue #3, Option A, airbnb requires.js style): every
// public export — the root and each subpath in package.json — loads
// cleanly under ESLint 10 in this package's own environment. The list
// below is explicit on purpose: a new export costs exactly one line
// here, and the coverage test fails if the list and package.json
// drift apart. reactPending is included: it loads here (this package
// pins TypeScript ^5.9); asserting that it stays unloadable under
// TypeScript 7 is the TS7 consumer fixture's job, not this smoke's.
const EXPORTS = {
  '.': '../dist/index.js',
  './base': '../dist/base.js',
  './jest': '../dist/jest.js',
  './node': '../dist/node.js',
  './react': '../dist/react.js',
  './react-pending': '../dist/react-pending.js',
  './react-native': '../dist/react-native.js',
  './tailwind': '../dist/tailwind.js',
  './typescript': '../dist/typescript.js',
};

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
);

test('smoke: the list covers every export declared in package.json', () => {
  assert.deepEqual(
    Object.keys(EXPORTS).sort(),
    Object.keys(packageJson.exports).sort(),
  );
});

// Subpath modules default-export their config array; the root module
// carries named exports only. Either way: a list of config arrays.
async function loadConfigArrays(specifier) {
  const mod = await import(specifier);
  if (Array.isArray(mod.default)) return [mod.default];
  return Object.values(mod).filter(value => Array.isArray(value));
}

for (const [subpath, specifier] of Object.entries(EXPORTS)) {
  test(`smoke: ${subpath} loads cleanly under ESLint 10`, async () => {
    const configs = await loadConfigArrays(specifier);
    assert.ok(configs.length > 0, `${subpath} exports no config array`);
    for (const blocks of configs) {
      assert.ok(blocks.length > 0, `${subpath} exports an empty config`);
      const eslint = new ESLint({
        overrideConfig: blocks,
        overrideConfigFile: true,
      });
      const results = await eslint.lintText('export const smoke = 1;\n', {
        filePath: 'smoke.js',
      });
      const fatals = results[0].messages.filter(message => message.fatal);
      assert.deepEqual(
        fatals,
        [],
        `${subpath} hit a fatal lint error: ${JSON.stringify(fatals)}`,
      );
    }
  });
}
