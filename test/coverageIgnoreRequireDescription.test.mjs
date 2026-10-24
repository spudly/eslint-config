import assert from 'node:assert/strict';
import {test} from 'node:test';

import {Linter} from 'eslint';

import coverageIgnorePlugin from '../dist/coverage-ignore-plugin.js';
import {coverageIgnore} from '../dist/index.js';

// Ported from Eciperay's eslint-rules/coverage-ignore-require-description
// .test.ts, adapted to this package's node:test harness: the rule is
// driven directly through its create() with a stub context, exactly as
// in the original.
const runRuleOnComments = comments => {
  const reports = [];
  const rule = coverageIgnorePlugin.rules['require-description'];
  const listeners = rule.create({
    report: descriptor => {
      reports.push({messageId: descriptor.messageId});
    },
  });
  listeners.Program({
    comments: comments.map(comment => {
      if (comment.loc) {
        return comment;
      }
      return {value: comment.value};
    }),
  });
  return reports;
};

test('coverage-ignore (ported): allows coverage ignores with a description', () => {
  assert.deepEqual(
    runRuleOnComments([
      {value: ' istanbul ignore next -- uncovered branch '},
      {value: ' c8 ignore next -- generated '},
    ]),
    [],
  );
});

test('coverage-ignore (ported): ignores unrelated comments', () => {
  assert.deepEqual(runRuleOnComments([{value: ' regular comment '}]), []);
});

test('coverage-ignore (ported): requires a description on istanbul and c8 ignore comments', () => {
  assert.deepEqual(
    runRuleOnComments([
      {value: ' istanbul ignore next ', loc: {start: {line: 1}}},
      {value: ' c8 ignore start ', loc: {start: {line: 2}}},
    ]),
    [{messageId: 'missing'}, {messageId: 'missing'}],
  );
});

test('coverage-ignore (ported): skips comments without a source location', () => {
  assert.deepEqual(runRuleOnComments([{value: ' istanbul ignore next '}]), []);
});

// Linter-API tests through the shared `coverageIgnore` config export.
const linter = new Linter();

function ruleIds(code, filename = 'x.js') {
  return linter
    .verify(code, [...coverageIgnore], {filename})
    .map(m => m.ruleId);
}

test('coverageIgnore export: istanbul ignore without a reason fires', () => {
  const ids = ruleIds(
    '/* istanbul ignore next */\nconst x = 1;\nexport default x;\n',
  );
  assert.ok(
    ids.includes('coverage-ignore/require-description'),
    `got: ${ids.join(', ')}`,
  );
});

test('coverageIgnore export: c8 ignore line comment without a reason fires', () => {
  const ids = ruleIds('// c8 ignore next\nconst x = 1;\nexport default x;\n');
  assert.ok(ids.includes('coverage-ignore/require-description'));
});

test('coverageIgnore export: ignore comments with a `-- reason` pass', () => {
  const ids = ruleIds(
    '/* istanbul ignore next -- branch is defensive */\nconst x = 1;\nexport default x;\n',
  );
  assert.ok(!ids.includes('coverage-ignore/require-description'));
});
