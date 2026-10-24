import assert from 'node:assert/strict';
import {test} from 'node:test';

import {ESLint} from 'eslint';

import {base, jest, node, react, reactNative, tailwind} from '../dist/index.js';

// Behavior fixtures, XO-style (issue #3, Option A): one fixture per
// export asserting its signature rules fire on code that violates them
// and stay silent on code that does not. The sets are deliberately
// small and intent-based — they change when a rule's INTENT changes,
// not on weekly rule-currency churn. Completeness (every rule
// configured) is check-rules' job; composition facts live in
// composition.test.mjs; loadability lives in exportsSmoke.test.mjs.
// Unlike the Linter-API tests elsewhere in this suite, these drive
// the real ESLint class end to end, the way a consumer's run does.

// Parsing scaffold only (JSX on, ESM): the exports under test carry
// rules and plugins, not parser options.
const jsxLang = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};

async function firedRuleIds(code, config, filePath) {
  const eslint = new ESLint({overrideConfig: config, overrideConfigFile: true});
  const results = await eslint.lintText(code, {filePath});
  return results[0].messages.map(message => message.ruleId);
}

test('behavior base: import-x signature fires on require, silent on import', async () => {
  const config = [...base];
  const bad = await firedRuleIds(
    "const fs = require('node:fs');\nexport default fs;\n",
    config,
    'fixture.js',
  );
  assert.ok(bad.includes('import-x/no-commonjs'), `got: ${bad.join(', ')}`);
  const good = await firedRuleIds(
    "import fs from 'node:fs';\nexport default fs;\n",
    config,
    'fixture.js',
  );
  assert.ok(!good.includes('import-x/no-commonjs'));
});

test('behavior base: unicorn signature fires on a messageless Error only', async () => {
  const config = [...base];
  const bad = await firedRuleIds('throw new Error();\n', config, 'fixture.js');
  assert.ok(bad.includes('unicorn/error-message'), `got: ${bad.join(', ')}`);
  const good = await firedRuleIds(
    "throw new Error('boom');\n",
    config,
    'fixture.js',
  );
  assert.ok(!good.includes('unicorn/error-message'));
});

test('behavior react: rules-of-hooks fires on a conditional hook only', async () => {
  const config = [jsxLang, ...react];
  const bad = await firedRuleIds(
    `import {useState} from 'react';
export const C = ({flag}) => {
  if (flag) {
    useState(0);
  }
  return null;
};
`,
    config,
    'Comp.jsx',
  );
  assert.ok(
    bad.includes('react-hooks/rules-of-hooks'),
    `got: ${bad.join(', ')}`,
  );
  const good = await firedRuleIds(
    `import {useState} from 'react';
export const C = () => {
  const [count] = useState(0);
  return count;
};
`,
    config,
    'Comp.jsx',
  );
  assert.ok(!good.includes('react-hooks/rules-of-hooks'));
});

test('behavior reactNative: vendored no-inline-styles fires on inline styles only', async () => {
  const config = [jsxLang, ...reactNative];
  const bad = await firedRuleIds(
    'export const C = () => <View style={{margin: 4}} />;\n',
    config,
    'Comp.jsx',
  );
  assert.ok(
    bad.includes('react-native/no-inline-styles'),
    `got: ${bad.join(', ')}`,
  );
  const good = await firedRuleIds(
    `import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({box: {margin: 4}});
export const C = () => <View style={styles.box} />;
`,
    config,
    'Comp.jsx',
  );
  assert.ok(!good.includes('react-native/no-inline-styles'));
});

test('behavior jest: no-focused-tests fires on test.only only', async () => {
  // This repo does not install jest itself, so the version is pinned
  // via settings (consumers with jest installed get auto-detection).
  const config = [...jest, {settings: {jest: {version: 30}}}];
  const bad = await firedRuleIds(
    "test.only('x', () => { expect(1).toBe(1); });\n",
    config,
    'fixture.test.js',
  );
  assert.ok(bad.includes('jest/no-focused-tests'), `got: ${bad.join(', ')}`);
  const good = await firedRuleIds(
    "test('x', () => { expect(1).toBe(1); });\n",
    config,
    'fixture.test.js',
  );
  assert.ok(!good.includes('jest/no-focused-tests'));
});

test('behavior tailwind: no-duplicate-classes fires on duplicates only', async () => {
  const config = [jsxLang, ...tailwind];
  const bad = await firedRuleIds(
    "export const B = () => <button className='flex flex'>x</button>;\n",
    config,
    'B.jsx',
  );
  assert.ok(
    bad.includes('better-tailwindcss/no-duplicate-classes'),
    `got: ${bad.join(', ')}`,
  );
  const good = await firedRuleIds(
    "export const B = () => <button className='flex'>x</button>;\n",
    config,
    'B.jsx',
  );
  assert.ok(!good.includes('better-tailwindcss/no-duplicate-classes'));
});

// `node` ships rules only; the documented consumer pattern attaches
// server paths to its blocks. This fixture follows that pattern.
const nodeForServer = node.map(block => ({
  ...block,
  files: ['packages/server/**'],
}));

test('behavior node: no-process-exit fires in server files only', async () => {
  const bad = await firedRuleIds(
    'process.exit(1);\n',
    nodeForServer,
    'packages/server/index.js',
  );
  assert.ok(bad.includes('n/no-process-exit'), `got: ${bad.join(', ')}`);
  const outside = await firedRuleIds(
    'process.exit(1);\n',
    nodeForServer,
    'packages/app/index.js',
  );
  assert.ok(!outside.includes('n/no-process-exit'));
});
