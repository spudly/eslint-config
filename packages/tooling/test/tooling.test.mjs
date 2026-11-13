import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';

import {
  actionlintInvocation,
  affectedWorkspaces,
  checkDrift,
  checkDriftForRepo,
  findAffectedTests,
} from '../index.js';

const EXISTING = [
  'packages/tooling/index.js',
  'packages/tooling/test/tooling.test.mjs',
  'src/widget.ts',
  'src/widget.test.ts',
  'src/other.ts',
];

test('a changed source file affects its colocated test', () => {
  assert.deepEqual(findAffectedTests(['src/widget.ts'], EXISTING), [
    'src/widget.test.ts',
  ]);
});

test('a changed test file affects itself', () => {
  assert.deepEqual(findAffectedTests(['src/widget.test.ts'], EXISTING), [
    'src/widget.test.ts',
  ]);
});

test('a file with no colocated test affects nothing', () => {
  assert.deepEqual(findAffectedTests(['src/other.ts'], EXISTING), []);
});

test('affected workspaces are the touched package directories', () => {
  assert.deepEqual(
    affectedWorkspaces([
      'packages/tooling/index.js',
      'packages/tooling/cli.js',
      'README.md',
    ]),
    ['packages/tooling'],
  );
});

test('the actionlint invocation only carries workflow files', () => {
  assert.deepEqual(
    actionlintInvocation(['.github/workflows/ci.yml', 'src/widget.ts']),
    {args: ['.github/workflows/ci.yml'], command: 'actionlint'},
  );
  assert.equal(actionlintInvocation(['src/widget.ts']), null);
});

const COMPLETE = {
  hooks: {
    'commit-msg': 'npx --no -- commitlint --edit "$1"',
    'pre-commit': 'npx lint-staged',
  },
  packageJson: {
    'lint-staged': {'*.{yml,yaml}': ['spudly-tooling actionlint']},
    'scripts': {
      'precommit:affected-tests': 'spudly-tooling affected-tests --staged',
    },
  },
};

test('a repo carrying the full contract has no drift', () => {
  assert.deepEqual(checkDrift(COMPLETE), []);
});

test('drift names each missing piece', () => {
  const missing = checkDrift({hooks: {}, packageJson: {}});
  assert.ok(missing.some(entry => entry.includes('precommit:affected-tests')));
  assert.ok(missing.some(entry => entry.includes('actionlint')));
  assert.ok(missing.some(entry => entry.includes('.husky/pre-commit')));
  assert.ok(missing.some(entry => entry.includes('.husky/commit-msg')));
});

test('the drift check reads a fixture repo from disk', () => {
  const root = mkdtempSync(join(tmpdir(), 'tooling-drift-'));
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify(COMPLETE.packageJson),
  );
  mkdirSync(join(root, '.husky'));
  for (const [hook, content] of Object.entries(COMPLETE.hooks)) {
    writeFileSync(join(root, '.husky', hook), content);
  }
  assert.deepEqual(checkDriftForRepo(root), []);
  const bare = mkdtempSync(join(tmpdir(), 'tooling-drift-bare-'));
  assert.ok(checkDriftForRepo(bare).length > 0);
});
