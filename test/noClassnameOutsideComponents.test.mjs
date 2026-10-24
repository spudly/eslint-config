import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import noClassnamePlugin from '../dist/no-classname-outside-components-plugin.js';
import {noClassNameOutsideComponents} from '../dist/index.js';

// Ported from Eciperay's eslint-rules/no-classname-outside-components
// .test.ts, adapted to this package's node:test harness: the rule is
// driven directly through its create() with a stub context, exactly as
// in the original. The shared version drops the original's
// app/web-only path gate and takes an `allowedSegment` option.
const runRule = (filename, options) => {
  const reports = [];
  const rule = noClassnamePlugin.rules['no-classname-outside-components'];
  const listeners = rule.create({
    filename,
    options: options ? [options] : [],
    report: descriptor => {
      reports.push({messageId: descriptor.messageId});
    },
  });
  listeners.JSXAttribute?.({
    type: 'JSXAttribute',
    name: {type: 'JSXIdentifier', name: 'className'},
    value: null,
    loc: {start: {line: 1, column: 0}, end: {line: 1, column: 20}},
  });
  return reports;
};

test('no-classname (ported): allows className inside src/components', () => {
  assert.deepEqual(
    runRule('/repo/packages/web/src/components/ui/PageTitle.tsx'),
    [],
  );
});

test('no-classname (ported): allows className in test files', () => {
  assert.deepEqual(
    runRule('/repo/packages/web/src/pages/HomePage.test.tsx'),
    [],
  );
});

test('no-classname (ported): forbids className in pages', () => {
  assert.deepEqual(runRule('/repo/packages/web/src/pages/HomePage.tsx'), [
    {messageId: 'forbidden'},
  ]);
});

test('no-classname (ported): forbids className in screens', () => {
  assert.deepEqual(runRule('/repo/packages/app/src/screens/HomeScreen.tsx'), [
    {messageId: 'forbidden'},
  ]);
});

test('no-classname (ported): non-Eciperay layouts are covered too (path gate removed)', () => {
  assert.deepEqual(runRule('/repo/apps/mobile/src/screens/Home.tsx'), [
    {messageId: 'forbidden'},
  ]);
  assert.deepEqual(runRule('/repo/apps/mobile/src/components/Card.tsx'), []);
});

test('no-classname (ported): custom allowedSegment option relocates the allowance', () => {
  assert.deepEqual(
    runRule('/repo/pkg/src/ui/Button.tsx', {allowedSegment: 'src/ui'}),
    [],
  );
  assert.deepEqual(
    runRule('/repo/pkg/src/components/Button.tsx', {
      allowedSegment: 'src/ui',
    }),
    [{messageId: 'forbidden'}],
  );
});

// Linter-API tests through the shared `noClassNameOutsideComponents`
// config export (namespace `spudly-ui`).
const linter = new Linter();
const jsxLang = {
  languageOptions: {
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
};
const code = 'export const P = () => <div className="x" />;\n';

function ruleIds(filename, config = noClassNameOutsideComponents) {
  return linter
    .verify(code, [jsxLang, ...config], {filename})
    .map(m => m.ruleId);
}

test('noClassNameOutsideComponents export: className in a page fires', () => {
  const ids = ruleIds('packages/web/src/pages/HomePage.tsx');
  assert.ok(
    ids.includes('spudly-ui/no-classname-outside-components'),
    `got: ${ids.join(', ')}`,
  );
});

test('noClassNameOutsideComponents export: className inside src/components passes', () => {
  const ids = ruleIds('packages/web/src/components/ui/PageTitle.tsx');
  assert.ok(!ids.includes('spudly-ui/no-classname-outside-components'));
});

test('noClassNameOutsideComponents export: className in a test file passes', () => {
  const ids = ruleIds('packages/web/src/pages/HomePage.test.tsx');
  assert.ok(!ids.includes('spudly-ui/no-classname-outside-components'));
});

test('noClassNameOutsideComponents export: generic layouts fire (no app/web gate)', () => {
  const ids = ruleIds('apps/mobile/src/screens/Home.tsx');
  assert.ok(ids.includes('spudly-ui/no-classname-outside-components'));
});

test('noClassNameOutsideComponents export: custom allowedSegment works through the Linter', () => {
  const config = [
    {
      files: ['**/*.tsx'],
      plugins: {'spudly-ui': noClassnamePlugin},
      rules: {
        'spudly-ui/no-classname-outside-components': [
          'error',
          {allowedSegment: 'src/ui'},
        ],
      },
    },
  ];
  assert.ok(
    !ruleIds('pkg/src/ui/Button.tsx', config).includes(
      'spudly-ui/no-classname-outside-components',
    ),
  );
  assert.ok(
    ruleIds('pkg/src/components/Button.tsx', config).includes(
      'spudly-ui/no-classname-outside-components',
    ),
  );
});
