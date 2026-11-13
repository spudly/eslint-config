import assert from 'node:assert/strict';
import {test} from 'node:test';

import {SOURCE, colocationMessages} from './testColocationHarness.ts';

// Integration tests for test-colocation/exact-base-name (issue #37):
// the source-sibling scan — the never-linted companions (manual test
// steps, snapshot images) enforced from a linted source file, the
// single-reporter rule, and the exemptions. Tests of the linted test
// file itself live in testColocation.test.ts.

test('test-colocation: misnamed manual test steps fail from the source sibling', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, 'Banana_Man.test.steps.md': '# steps\n'},
    ['BananaMan.tsx'],
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0]?.message ?? '', /Banana_Man\.test\.steps\.md/u);
});

test('test-colocation: exact-name manual test steps pass from the source sibling', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.steps.md': '# steps\n'},
    ['BananaMan.tsx'],
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: snapshot starting with the exact base passes', async () => {
  const messages = await colocationMessages(
    {
      'BananaMan.tsx': SOURCE,
      '__snapshots__/BananaMan--variant--othervariant.png': 'png',
      '__snapshots__/BananaMan-chromium.png': 'png',
    },
    ['BananaMan.tsx'],
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: snapshot not starting with a sibling base fails', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, '__snapshots__/Other--variant.png': 'png'},
    ['BananaMan.tsx'],
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0]?.message ?? '', /Other--variant\.png/u);
});

test('test-colocation: a source file without tests is not flagged', async () => {
  const messages = await colocationMessages({'BananaMan.tsx': SOURCE}, [
    'BananaMan.tsx',
  ]);
  assert.deepEqual(messages, []);
});

test('test-colocation: an orphan companion is reported once per directory, not once per source file', async () => {
  const messages = await colocationMessages(
    {
      'Apple.tsx': SOURCE,
      'BananaMan.tsx': SOURCE,
      'Banana_Man.test.steps.md': '# steps\n',
    },
    ['Apple.tsx', 'BananaMan.tsx'],
  );
  assert.equal(messages.length, 1);
});

test('test-colocation: helpers in a dedicated test/ folder are exempt', async () => {
  const messages = await colocationMessages({'test/helper.test.ts': SOURCE}, [
    'test/helper.test.ts',
  ]);
  assert.deepEqual(messages, []);
});

test('test-colocation: non-test fixtures under __tests__/ are untouched', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, '__tests__/fixture.ts': SOURCE},
    ['BananaMan.tsx'],
  );
  assert.deepEqual(messages, []);
});
