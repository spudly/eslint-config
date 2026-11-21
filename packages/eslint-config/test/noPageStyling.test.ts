import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';
import type {ESLint} from 'eslint';

import noPageStylingPlugin from '../dist/no-page-styling-plugin.js';
import {noPageStyling} from '../dist/index.js';

// Behavior tests for the ported no-page-styling rule (issue #60),
// carried over from the design-system's `noPageStyling.test.ts`
// (design-system #119, simplified shape per #297): scoped files
// must not apply styling directly — no direct Tamagui imports, no
// className, no inline style prop.
//
// Driven through ESLint's Linter on plain-JSX snippets: the default
// parser cannot parse TypeScript syntax, but the rule operates
// purely on import and JSX nodes, so JSX snippets exercise it
// fully. The DS suite's two config-level cases (the DS repo's own
// eslint.config.ts wiring, and dormancy under that repo's config)
// do not carry over — they tested the design-system repo's config,
// not this package. Their counterparts here are the shipped-config
// cases at the bottom: the fragment registers the rule at 'warn'
// with no baked-in `files:` globs, and a consumer's own scoping
// decides where it fires.
const linter = new Linter();
const jsxLang: Linter.Config = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};

function messageIds(
  code: string,
  config: Linter.Config[],
  filename = 'src/pages/ExamplePage.tsx',
) {
  return linter
    .verify(code, [jsxLang, ...config], {filename})
    .map(m => m.messageId);
}

function withSeverity(severity: 'error' | 'warn'): Linter.Config[] {
  return [
    {
      // Scoped the way a consumer scopes it: the plugin block needs
      // a `files:` glob before ESLint matches .tsx files at all.
      files: ['**/*.tsx'],
      plugins: {
        'no-page-styling': noPageStylingPlugin as unknown as ESLint.Plugin,
      },
      rules: {'no-page-styling/no-page-styling': severity},
    },
  ];
}

const atError = withSeverity('error');

test('no-page-styling: direct Tamagui imports are banned in scoped files', () => {
  assert.deepEqual(messageIds(`import { YStack } from "tamagui";`, atError), [
    'tamaguiImport',
  ]);
  assert.deepEqual(
    messageIds(`import { View } from "@tamagui/core";`, atError),
    ['tamaguiImport'],
  );
  assert.deepEqual(messageIds(`import "tamagui";`, atError), ['tamaguiImport']);
});

test('no-page-styling: non-Tamagui imports are untouched', () => {
  assert.deepEqual(
    messageIds(`import { Alert } from "../../components";`, atError),
    [],
  );
  assert.deepEqual(messageIds(`import React from "react";`, atError), []);
});

test('no-page-styling: dynamic Tamagui imports are banned in scoped files', () => {
  assert.deepEqual(messageIds(`const m = import("tamagui");`, atError), [
    'tamaguiImport',
  ]);
  assert.deepEqual(messageIds(`const m = import("@tamagui/core");`, atError), [
    'tamaguiImport',
  ]);
  assert.deepEqual(messageIds(`const m = import("react");`, atError), []);
  assert.deepEqual(messageIds(`const m = import(null);`, atError), []);
  assert.deepEqual(messageIds('const m = import(`tamagui`);', atError), [
    'tamaguiImport',
  ]);
  assert.deepEqual(messageIds('const m = import(`react`);', atError), []);
  assert.deepEqual(messageIds('const m = import(`${name}`);', atError), []);
});

test('no-page-styling: className and the inline style prop are banned in scoped files', () => {
  assert.deepEqual(messageIds(`<div className="x" />`, atError), ['className']);
  assert.deepEqual(messageIds(`<Text style={{ color: "red" }} />`, atError), [
    'styleProp',
  ]);
});

test('no-page-styling: Tamagui styling props are not enumerated (#297 simplification)', () => {
  assert.deepEqual(messageIds(`<Text color="$primary" />`, atError), []);
  assert.deepEqual(messageIds(`<Text fontSize={16} />`, atError), []);
  assert.deepEqual(
    messageIds(`<Card hoverStyle={{ opacity: 0.8 }} />`, atError),
    [],
  );
  assert.deepEqual(messageIds(`<Card $gtSm={{ padding: 8 }} />`, atError), []);
});

test('no-page-styling: layout primitives, spreads and styled() are not policed on their own', () => {
  assert.deepEqual(messageIds(`<YStack gap="$2" />`, atError), []);
  assert.deepEqual(messageIds(`<Button {...chipProps} />`, atError), []);
  assert.deepEqual(messageIds(`const Box = styled(View, {});`, atError), []);
});

test('no-page-styling: semantic props, data and callbacks are untouched', () => {
  assert.deepEqual(messageIds(`<Alert intent="error" />`, atError), []);
  assert.deepEqual(
    messageIds(
      `<Button variant="secondary" onPress={handler} disabled />`,
      atError,
    ),
    [],
  );
  assert.deepEqual(
    messageIds(
      `<RecipesPage items={items} onRecipePress={handler} />`,
      atError,
    ),
    [],
  );
});

test('no-page-styling: the rule only applies where the consumer scopes it', () => {
  // The shipped fragment carries no `files:` globs; the consumer
  // attaches its own (here: the design system's pages + views).
  const scoped: Linter.Config[] = noPageStyling.map(block => ({
    ...block,
    files: ['src/pages/**/*.tsx', 'src/views/**/*.tsx'],
  }));
  const pageIds = messageIds(`<div className="x" />`, scoped);
  assert.deepEqual(pageIds, ['className']);
  const widgetMessages = linter.verify(
    `<div className="x" />`,
    [jsxLang, ...scoped],
    {
      filename: 'src/widgets/Example.tsx',
    },
  );
  const ruleReports = widgetMessages.filter(
    message => message.ruleId === 'no-page-styling/no-page-styling',
  );
  assert.deepEqual(ruleReports, []);
});

test('no-page-styling: shipped severity is warn, with no baked-in file globs', () => {
  assert.equal(noPageStyling.length, 1);
  const [block] = noPageStyling;
  assert.ok(block);
  assert.ok(!('files' in block), 'the fragment must not bake in file globs');
  assert.deepEqual(block.rules, {'no-page-styling/no-page-styling': 'warn'});
  // Linting through the shipped fragment requires a consumer's
  // `files:` glob before ESLint matches .tsx files (the `node`
  // export's rules-only shape has the same property).
  const consumed: Linter.Config[] = noPageStyling.map(b => ({
    ...b,
    files: ['**/*.tsx'],
  }));
  assert.deepEqual(messageIds(`<div className="x" />`, consumed), [
    'className',
  ]);
});
