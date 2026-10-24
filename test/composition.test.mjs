import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  base,
  jest,
  node,
  react,
  reactNative,
  tailwind,
  typescriptPendingIgnores,
} from '../dist/index.js';
import reactPending from '../dist/react-pending.js';

// Composition assertions (issue #3, Option A): targeted, load-bearing
// facts about how each export is assembled — the plugin registrations,
// the groups folded into `base`, and the ordering those folds depend
// on. Deliberately NOT full effective-config snapshots: a snapshot
// changes on every weekly rule-currency edit and gets rubber-stamped,
// while these assertions change only when the composition itself
// changes. Rule presence per se is covered by the behavior fixtures
// and by check-rules; base.test.mjs asserts the folded rule ids.

function pluginNamespaces(blocks) {
  const namespaces = new Set();
  for (const block of blocks) {
    for (const name of Object.keys(block.plugins ?? {})) {
      namespaces.add(name);
    }
  }
  return namespaces;
}

function severityOf(entry) {
  const severity = Array.isArray(entry) ? entry[0] : entry;
  if (severity === 2 || severity === 'error') return 'error';
  if (severity === 1 || severity === 'warn') return 'warn';
  return 'off';
}

// The severity an export ultimately gives a rule: later blocks win in
// flat config, so scan in order and keep the last setting found.
function effectiveSeverity(blocks, ruleId) {
  let result;
  for (const block of blocks) {
    if (block.rules && ruleId in block.rules) {
      result = severityOf(block.rules[ruleId]);
    }
  }
  return result;
}

function firstIndexWithSeverity(blocks, ruleId, severity) {
  return blocks.findIndex(
    block => severityOf(block.rules?.[ruleId]) === severity,
  );
}

test('composition: each export registers the plugins its rules need', () => {
  const expected = {
    base: ['coverage-ignore', 'eslint-comments', 'import-x', 'unicorn'],
    jest: ['jest'],
    node: ['n'],
    react: ['react-hooks'],
    reactNative: ['react-native'],
    reactPending: ['@eslint-react'],
    tailwind: ['better-tailwindcss'],
  };
  const byName = {
    base,
    jest,
    node,
    react,
    reactNative,
    reactPending,
    tailwind,
  };
  for (const [name, plugins] of Object.entries(expected)) {
    const actual = pluginNamespaces(byName[name]);
    for (const plugin of plugins) {
      assert.ok(actual.has(plugin), `${name} must register ${plugin}`);
    }
  }
});

test('composition: base does not absorb the opt-in or scoped groups', () => {
  const namespaces = pluginNamespaces(base);
  for (const plugin of ['jest', 'n', 'react-hooks', 'react-native']) {
    assert.ok(!namespaces.has(plugin), `base must not register ${plugin}`);
  }
});

test('composition: pending split — react ships hooks only, @eslint-react stays pending', () => {
  // Issue #8: while upstream is not TypeScript 7-compatible, `react`
  // must not register the @eslint-react plugin (its plugin chain
  // crashes on load under TS7) and reactPending must carry it.
  // Restoration folds the pending block back into `react` and this
  // assertion is updated with it.
  assert.ok(!pluginNamespaces(react).has('@eslint-react'));
  assert.ok(pluginNamespaces(reactPending).has('@eslint-react'));
  assert.equal(
    effectiveSeverity(react, 'react-hooks/rules-of-hooks'),
    'error',
    'the hooks signature rules survive the split at error',
  );
});

test('composition: typescriptPendingIgnores is a single ignores-only block', () => {
  assert.equal(typescriptPendingIgnores.length, 1);
  const [block] = typescriptPendingIgnores;
  assert.ok(Array.isArray(block.ignores) && block.ignores.length > 0);
  assert.ok(!('rules' in block), 'ignores-only: no rules');
  assert.ok(!('plugins' in block), 'ignores-only: no plugins');
});

test('composition: base folds — CommonJS overrides land after import-x and unicorn', () => {
  // The .cjs override block turns off import-x/no-commonjs and
  // unicorn/prefer-module; it only works because it comes AFTER the
  // folded sections that enable them. If the fold order changes, the
  // override silently stops winning.
  const overrideIndex = base.findIndex(
    block =>
      (block.files ?? []).includes('**/*.cjs') &&
      severityOf(block.rules?.['import-x/no-commonjs']) === 'off',
  );
  assert.ok(overrideIndex !== -1, 'base must carry the CommonJS override');
  const importXIndex = firstIndexWithSeverity(
    base,
    'import-x/no-commonjs',
    'error',
  );
  const unicornIndex = firstIndexWithSeverity(
    base,
    'unicorn/prefer-module',
    'error',
  );
  assert.ok(importXIndex >= 0, 'import-x section must be folded into base');
  assert.ok(unicornIndex >= 0, 'unicorn section must be folded into base');
  assert.ok(importXIndex < overrideIndex, 'import-x before the overrides');
  assert.ok(unicornIndex < overrideIndex, 'unicorn before the overrides');
});

test('composition: base ends with the Prettier block, disabling formatting rules', () => {
  const last = base.at(-1);
  assert.ok(last, 'base must not be empty');
  assert.ok(!('plugins' in last), 'the Prettier block registers no plugins');
  const entries = Object.entries(last.rules ?? {});
  assert.ok(entries.length > 0, 'the Prettier block must carry rules');
  assert.ok(
    entries.every(([, entry]) => severityOf(entry) === 'off'),
    'every rule in the last block is off (eslint-config-prettier)',
  );
});
