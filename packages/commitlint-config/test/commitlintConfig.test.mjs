import assert from 'node:assert/strict';
import test from 'node:test';

import lint from '@commitlint/lint';
import load from '@commitlint/load';

import seed from '../index.js';

async function lintMessage(message) {
  const loaded = await load(seed);
  return lint(message, loaded.rules, {
    parserOpts: loaded.parserPreset?.parserOpts ?? {},
    plugins: loaded.plugins ?? {},
    ignores: loaded.ignores ?? [],
    defaultIgnores: loaded.defaultIgnores ?? true,
  });
}

test('the base extends config-conventional', () => {
  assert.deepEqual(seed.extends, ['@commitlint/config-conventional']);
});

test('a conventional message passes', async () => {
  const report = await lintMessage('feat(parser): add a thing');
  assert.equal(report.valid, true, JSON.stringify(report.errors));
});

test('a scopeless conventional message passes (scopes are repo-local)', async () => {
  const report = await lintMessage('fix: handle an empty input');
  assert.equal(report.valid, true, JSON.stringify(report.errors));
});

test('a message with no conventional type fails', async () => {
  const report = await lintMessage('add a thing');
  assert.equal(report.valid, false);
});

test('a message with an empty subject fails', async () => {
  const report = await lintMessage('feat:');
  assert.equal(report.valid, false);
});

test('a message with an unknown type fails', async () => {
  const report = await lintMessage('frobnicate: add a thing');
  assert.equal(report.valid, false);
});
