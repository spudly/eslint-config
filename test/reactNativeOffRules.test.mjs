import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import reactNativePlugin from '../dist/react-native-plugin/index.js';

// sort-styles and split-platform-components ship in the vendored plugin
// but are 'off' in the reactNative config export (matching Eciperay).
// These tests exercise the rules directly through the plugin object.
const linter = new Linter();
const jsxLang = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};

function ruleIds(code, ruleId, filename) {
  const config = [
    jsxLang,
    {
      files: ['**/*.{js,jsx}'],
      plugins: {'react-native': reactNativePlugin},
      rules: {[ruleId]: 'error'},
    },
  ];
  return linter.verify(code, config, {filename}).map(m => m.ruleId);
}

test('vendored plugin exposes exactly the 7 upstream rules', () => {
  assert.deepEqual(Object.keys(reactNativePlugin.rules).sort(), [
    'no-color-literals',
    'no-inline-styles',
    'no-raw-text',
    'no-single-element-style-arrays',
    'no-unused-styles',
    'sort-styles',
    'split-platform-components',
  ]);
});

test('sort-styles (off by default): unsorted class names fire', () => {
  const bad = `import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  zebra: {margin: 4},
  alpha: {margin: 4},
});\n`;
  const ids = ruleIds(bad, 'react-native/sort-styles', 'Comp.jsx');
  assert.ok(ids.includes('react-native/sort-styles'), `got: ${ids}`);
});

test('sort-styles (off by default): sorted class names pass', () => {
  const good = `import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  alpha: {margin: 4},
  zebra: {margin: 4},
});\n`;
  const ids = ruleIds(good, 'react-native/sort-styles', 'Comp.jsx');
  assert.ok(!ids.includes('react-native/sort-styles'));
});

test('split-platform-components (off by default): iOS import in a plain file fires', () => {
  const code =
    "import {FooIOS} from 'react-native';\nexport const x = FooIOS;\n";
  const ids = ruleIds(
    code,
    'react-native/split-platform-components',
    'Comp.jsx',
  );
  assert.ok(
    ids.includes('react-native/split-platform-components'),
    `got: ${ids}`,
  );
});

test('split-platform-components (off by default): iOS import in an .ios file passes', () => {
  const code =
    "import {FooIOS} from 'react-native';\nexport const x = FooIOS;\n";
  const ids = ruleIds(
    code,
    'react-native/split-platform-components',
    'Comp.ios.jsx',
  );
  assert.ok(!ids.includes('react-native/split-platform-components'));
});
