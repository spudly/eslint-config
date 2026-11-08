import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';
import type {ESLint} from 'eslint';

import jsxNoLiteralsPlugin from '../dist/jsx-no-literals-plugin.js';
import {react} from '../dist/index.js';

// Behavior tests for the ported jsx-no-literals rule (issue #42),
// driven through the Linter API under the `react` export's shipped
// configuration, plus option-level cases (allowedStrings,
// elementOverrides, the upstream blanket attribute mode) driven
// through the plugin directly.
const linter = new Linter();
const jsxLang: Linter.Config = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};

function ruleIds(code: string, config: Linter.Config[], filename = 'Comp.jsx') {
  return linter
    .verify(code, [jsxLang, ...config], {filename})
    .map(m => m.ruleId);
}

function withOptions(options: Record<string, unknown>): Linter.Config[] {
  return [
    {
      files: ['**/*.{ts,tsx,jsx}'],
      plugins: {
        'jsx-no-literals': jsxNoLiteralsPlugin as unknown as ESLint.Plugin,
      },
      rules: {'jsx-no-literals/no-literals': ['error', options]},
    },
  ];
}

const SHIPPED = {
  noStrings: true,
  restrictedAttributes: ['aria-label', 'alt', 'placeholder', 'title'],
};

test('jsx-no-literals (in react): JSXText child is flagged', () => {
  const ids = ruleIds('export const C = () => <div>Hello</div>;\n', react);
  assert.ok(
    ids.includes('jsx-no-literals/no-literals'),
    `got: ${ids.join(', ')}`,
  );
});

test('jsx-no-literals (in react): string-literal expression child is flagged under noStrings', () => {
  const ids = ruleIds("export const C = () => <div>{'Hello'}</div>;\n", react);
  assert.ok(
    ids.includes('jsx-no-literals/no-literals'),
    `got: ${ids.join(', ')}`,
  );
});

test('jsx-no-literals (in react): expression values pass', () => {
  const ids = ruleIds(
    'export const C = ({label}) => <div>{label}</div>;\n',
    react,
  );
  assert.ok(!ids.includes('jsx-no-literals/no-literals'));
});

test('jsx-no-literals (in react): whitespace, punctuation and symbol literals pass', () => {
  for (const code of [
    'export const C = () => <div>—</div>;\n',
    'export const C = () => <div>·</div>;\n',
    "export const C = () => <div>{'&'}</div>;\n",
    'export const C = () => <div> </div>;\n',
  ]) {
    const ids = ruleIds(code, react);
    assert.ok(
      !ids.includes('jsx-no-literals/no-literals'),
      `${code} got: ${ids.join(', ')}`,
    );
  }
});

test('jsx-no-literals (in react): literals in restricted attributes are flagged', () => {
  for (const code of [
    'export const C = () => <button aria-label="Close" />;\n',
    'export const C = () => <input placeholder="Search" />;\n',
    'export const C = () => <div title="Details" />;\n',
    'export const C = () => <img alt="A chart" />;\n',
  ]) {
    const ids = ruleIds(code, react);
    assert.ok(
      ids.includes('jsx-no-literals/no-literals'),
      `${code} got: ${ids.join(', ')}`,
    );
  }
});

test('jsx-no-literals (in react): literals in non-restricted attributes pass', () => {
  const code =
    'export const C = ({label}) => <a href="/home" id="main-link">{label}</a>;\n';
  assert.ok(!ruleIds(code, react).includes('jsx-no-literals/no-literals'));
  const button = 'export const C = () => <button type="button" />;\n';
  assert.ok(!ruleIds(button, react).includes('jsx-no-literals/no-literals'));
});

test('jsx-no-literals (in react): template-literal value in a restricted attribute is flagged', () => {
  const ids = ruleIds(
    'export const C = () => <input placeholder={`Search`} />;\n',
    react,
  );
  assert.ok(
    ids.includes('jsx-no-literals/no-literals'),
    `got: ${ids.join(', ')}`,
  );
});

test('jsx-no-literals (in react): template-literal value in a non-restricted attribute passes', () => {
  const ids = ruleIds(
    'export const C = ({label}) => <div className={`box`}>{label}</div>;\n',
    react,
  );
  assert.ok(
    !ids.includes('jsx-no-literals/no-literals'),
    `got: ${ids.join(', ')}`,
  );
});

test('jsx-no-literals (in react): shipped severity is warn with the planned options', () => {
  const block = react.find(
    b => b.rules && 'jsx-no-literals/no-literals' in b.rules,
  );
  assert.ok(block?.rules);
  assert.deepEqual(block.rules['jsx-no-literals/no-literals'], [
    'warn',
    SHIPPED,
  ]);
});

test('jsx-no-literals: allowedStrings are honored', () => {
  const config = withOptions({...SHIPPED, allowedStrings: ['OK']});
  assert.ok(
    !ruleIds('export const C = () => <div>OK</div>;\n', config).includes(
      'jsx-no-literals/no-literals',
    ),
  );
  assert.ok(
    ruleIds('export const C = () => <div>Cancel</div>;\n', config).includes(
      'jsx-no-literals/no-literals',
    ),
  );
});

test('jsx-no-literals: elementOverrides allowElement exempts the element', () => {
  const config = withOptions({
    ...SHIPPED,
    elementOverrides: {Wrapper: {allowElement: true}},
  });
  assert.ok(
    !ruleIds(
      'export const C = () => <Wrapper>Hello</Wrapper>;\n',
      config,
    ).includes('jsx-no-literals/no-literals'),
  );
  assert.ok(
    ruleIds('export const C = () => <div>Hello</div>;\n', config).includes(
      'jsx-no-literals/no-literals',
    ),
  );
});

test('jsx-no-literals: elementOverrides can tighten noStrings per element', () => {
  const config = withOptions({
    elementOverrides: {Strict: {noStrings: true}},
  });
  // Base config has noStrings off, so a {'…'} container passes in a
  // plain element but is flagged inside the overridden one.
  assert.ok(
    !ruleIds("export const C = () => <div>{'Hello'}</div>;\n", config).includes(
      'jsx-no-literals/no-literals',
    ),
  );
  assert.ok(
    ruleIds(
      "export const C = () => <Strict>{'Hello'}</Strict>;\n",
      config,
    ).includes('jsx-no-literals/no-literals'),
  );
});

test('jsx-no-literals: without restrictedAttributes, upstream blanket attribute behavior applies', () => {
  const config = withOptions({noStrings: true});
  assert.ok(
    ruleIds(
      'export const C = () => <button type="button" />;\n',
      config,
    ).includes('jsx-no-literals/no-literals'),
  );
});

test('jsx-no-literals: without noStrings, bare attribute literals are reported as missing containers only in JSX', () => {
  const config = withOptions({});
  // Upstream default mode: JSXText outside an expression container is
  // still reported (literalNotInJSXExpression); attribute strings are
  // not (that is what noStrings / noAttributeStrings gate).
  assert.ok(
    ruleIds('export const C = () => <div>Hello</div>;\n', config).includes(
      'jsx-no-literals/no-literals',
    ),
  );
  assert.ok(
    !ruleIds(
      'export const C = () => <button type="button" />;\n',
      config,
    ).includes('jsx-no-literals/no-literals'),
  );
});
