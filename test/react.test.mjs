import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {react, reactNative, tailwind} from '../dist/index.js';
import reactPending from '../dist/react-pending.js';

// The @eslint-react rules live in the pending export until upstream
// is TypeScript 7-compatible (issue #8); these tests exercise the
// restored composition (react + reactPending) that consumers get back
// at restore time, so the verbatim preservation is proven by behavior,
// not just by inspection.
const reactRestored = [...react, ...reactPending];

const linter = new Linter();
const jsxLang = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};

function ruleIds(code, config, filename = 'Comp.jsx') {
  return linter
    .verify(code, [jsxLang, ...config], {filename})
    .map(m => m.ruleId);
}

test('react: @eslint-react/no-missing-key fires without a key', () => {
  const code = `export const List = ({items}) => (
    <ul>{items.map(item => <li>{item.name}</li>)}</ul>
  );\n`;
  const ids = ruleIds(code, reactRestored);
  assert.ok(
    ids.includes('@eslint-react/no-missing-key'),
    `got: ${ids.join(', ')}`,
  );
});

test('react: no-missing-key passes when keys are present', () => {
  const code = `export const List = ({items}) => (
    <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
  );\n`;
  const ids = ruleIds(code, reactRestored);
  assert.ok(!ids.includes('@eslint-react/no-missing-key'));
});

test('react: jsx-no-comment-textnodes fires on comment-like JSX text', () => {
  const code = 'export const C = () => <div>/* not a comment */</div>;\n';
  const ids = ruleIds(code, reactRestored);
  assert.ok(
    ids.includes('@eslint-react/jsx-no-comment-textnodes'),
    `got: ${ids.join(', ')}`,
  );
});

test('react: react-hooks/rules-of-hooks fires on a conditional hook', () => {
  const code = `import {useState} from 'react';
export const C = ({flag}) => {
  if (flag) {
    useState(0);
  }
  return null;
};\n`;
  const ids = ruleIds(code, [...react]);
  assert.ok(
    ids.includes('react-hooks/rules-of-hooks'),
    `got: ${ids.join(', ')}`,
  );
});

test('reactNative: inline styles and color literals fire', () => {
  const code = `export const C = () => <View style={{color: 'red', margin: 4}} />;\n`;
  const ids = ruleIds(code, [...reactNative]);
  assert.ok(ids.includes('react-native/no-inline-styles'), `got: ${ids}`);
  assert.ok(ids.includes('react-native/no-color-literals'), `got: ${ids}`);
});

test('reactNative: StyleSheet color literal fires, variable passes', () => {
  const bad = `import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({box: {backgroundColor: '#fff'}});
export const C = () => <View style={styles.box} />;\n`;
  const badIds = ruleIds(bad, [...reactNative]);
  assert.ok(
    badIds.includes('react-native/no-color-literals'),
    `got: ${badIds}`,
  );
  const good = `import {StyleSheet} from 'react-native';
const brand = '#fff';
const styles = StyleSheet.create({box: {backgroundColor: brand}});
export const C = () => <View style={styles.box} />;\n`;
  const goodIds = ruleIds(good, [...reactNative]);
  assert.ok(!goodIds.includes('react-native/no-color-literals'));
  assert.ok(!goodIds.includes('react-native/no-inline-styles'));
});

test('reactNative: no-raw-text fires outside Text, passes inside', () => {
  const bad = 'export const C = () => <View>Loose text</View>;\n';
  assert.ok(
    ruleIds(bad, [...reactNative]).includes('react-native/no-raw-text'),
  );
  const good = 'export const C = () => <Text>Loose text</Text>;\n';
  assert.ok(
    !ruleIds(good, [...reactNative]).includes('react-native/no-raw-text'),
  );
});

test('reactNative: single-element style arrays fire', () => {
  const bad = 'export const C = () => <View style={[styles.box]} />;\n';
  assert.ok(
    ruleIds(bad, [...reactNative]).includes(
      'react-native/no-single-element-style-arrays',
    ),
  );
  const good = 'export const C = () => <View style={styles.box} />;\n';
  assert.ok(
    !ruleIds(good, [...reactNative]).includes(
      'react-native/no-single-element-style-arrays',
    ),
  );
});

test('reactNative: no-unused-styles fires for unreferenced keys', () => {
  const code = `import {StyleSheet, Text, View} from 'react-native';
export const C = () => (
  <View style={styles.used}><Text>hi</Text></View>
);
const styles = StyleSheet.create({
  used: {margin: 4},
  unused: {margin: 8},
});\n`;
  const msgs = linter.verify(code, [jsxLang, ...reactNative], {
    filename: 'Comp.jsx',
  });
  const unused = msgs.filter(m => m.ruleId === 'react-native/no-unused-styles');
  assert.equal(unused.length, 1, JSON.stringify(msgs));
  assert.match(unused[0].message, /styles\.unused/);
});

test('reactNative: no-unused-styles passes when all keys are used', () => {
  const code = `import {StyleSheet, Text, View} from 'react-native';
export const C = () => (
  <View style={styles.used}><Text>hi</Text></View>
);
const styles = StyleSheet.create({used: {margin: 4}});\n`;
  const ids = ruleIds(code, [...reactNative]);
  assert.ok(!ids.includes('react-native/no-unused-styles'));
});

test('tailwind: duplicate classes fire', () => {
  const code =
    "export const B = () => <button className='flex flex'>x</button>;\n";
  const ids = ruleIds(code, [...tailwind], 'B.jsx');
  assert.ok(
    ids.includes('better-tailwindcss/no-duplicate-classes'),
    `got: ${ids.join(', ')}`,
  );
});
