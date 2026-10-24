import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import {react} from '../dist/index.js';
import reactPending from '../dist/react-pending.js';

// The @eslint-react rules live in the pending export until upstream
// is TypeScript 7-compatible (issue #8); the restored composition
// (react + reactPending) is what consumers get back at restore time.
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

// ── Issue #4: the @eslint-react evaluation is complete ─────────────────────
// Every rule that was held 'off' as undecided in reactPending was
// trialled against the design system's src/ tree and decided (39
// 'error'; the three type-requiring rules stay 'off' with the
// typed-linting rationale). The @eslint-react hooks rules stay 'off' by the
// recorded hooks-source decision (eslint-plugin-react-hooks is the
// hooks source). These assertions pin the decisions so a future
// rule-currency edit cannot silently undecide one.
const EVALUATED_ERROR_RULES = [
  '@eslint-react/error-boundaries',
  '@eslint-react/globals',
  '@eslint-react/immutability',
  '@eslint-react/no-children-count',
  '@eslint-react/no-children-for-each',
  '@eslint-react/no-children-map',
  '@eslint-react/no-children-only',
  '@eslint-react/no-children-to-array',
  '@eslint-react/no-clone-element',
  '@eslint-react/no-context-provider',
  '@eslint-react/no-create-ref',
  '@eslint-react/no-duplicate-key',
  '@eslint-react/no-misused-capture-owner-stack',
  '@eslint-react/no-nested-lazy-component-declarations',
  '@eslint-react/no-unnecessary-use-prefix',
  '@eslint-react/no-use-context',
  '@eslint-react/purity',
  '@eslint-react/refs',
  '@eslint-react/set-state-in-effect',
  '@eslint-react/set-state-in-render',
  '@eslint-react/static-components',
  '@eslint-react/unsupported-syntax',
  '@eslint-react/use-memo',
  '@eslint-react/jsx-no-children-prop-with-children',
  '@eslint-react/jsx-no-key-after-spread',
  '@eslint-react/jsx-no-leaked-dollar',
  '@eslint-react/jsx-no-leaked-semicolon',
  '@eslint-react/dom-no-flush-sync',
  '@eslint-react/dom-no-unsafe-iframe-sandbox',
  '@eslint-react/dom-no-use-form-state',
  '@eslint-react/web-api-no-leaked-event-listener',
  '@eslint-react/web-api-no-leaked-fetch',
  '@eslint-react/web-api-no-leaked-intersection-observer',
  '@eslint-react/web-api-no-leaked-interval',
  '@eslint-react/web-api-no-leaked-resize-observer',
  '@eslint-react/web-api-no-leaked-timeout',
  '@eslint-react/naming-convention-context-name',
  '@eslint-react/naming-convention-id-name',
  '@eslint-react/naming-convention-ref-name',
];

function pendingSeverity(ruleId) {
  let result;
  for (const block of reactPending) {
    if (block.rules && ruleId in block.rules) {
      const entry = block.rules[ruleId];
      result = Array.isArray(entry) ? entry[0] : entry;
    }
  }
  return result;
}

test('reactPending: the 39 enforceable evaluated @eslint-react rules are error (issue #4)', () => {
  assert.equal(EVALUATED_ERROR_RULES.length, 39);
  for (const ruleId of EVALUATED_ERROR_RULES) {
    assert.equal(
      pendingSeverity(ruleId),
      'error',
      `${ruleId} must stay 'error' per the issue #4 decisions`,
    );
  }
});

test('reactPending: type-requiring rules stay off until typed linting exists (issue #4)', () => {
  // no-implicit-* require type information: as 'error' they crash any
  // lint run without typed parser setup (verified — the restored
  // composition throws on an untyped file). Consumers lint untyped
  // today, so they stay 'off' with that rationale until restoration.
  assert.equal(pendingSeverity('@eslint-react/no-implicit-children'), 'off');
  assert.equal(pendingSeverity('@eslint-react/no-implicit-key'), 'off');
  assert.equal(pendingSeverity('@eslint-react/no-implicit-ref'), 'off');
});

test('reactPending: @eslint-react hooks rules stay off (hooks source is react-hooks)', () => {
  assert.equal(pendingSeverity('@eslint-react/rules-of-hooks'), 'off');
  assert.equal(pendingSeverity('@eslint-react/exhaustive-deps'), 'off');
});

test('react: restored composition fires no-children-map on Children.map only', () => {
  const bad = `import {Children} from 'react';
export const C = ({children}) => <ul>{Children.map(children, child => child)}</ul>;\n`;
  const badIds = ruleIds(bad, reactRestored);
  assert.ok(
    badIds.includes('@eslint-react/no-children-map'),
    `got: ${badIds.join(', ')}`,
  );
  const good = `export const C = ({items}) => (
    <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
  );\n`;
  const goodIds = ruleIds(good, reactRestored);
  assert.ok(!goodIds.includes('@eslint-react/no-children-map'));
});
