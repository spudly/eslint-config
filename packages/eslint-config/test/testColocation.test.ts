import assert from 'node:assert/strict';
import {test} from 'node:test';

import {SOURCE, colocationMessages} from './testColocationHarness.ts';

// Integration tests for test-colocation/exact-base-name (issue #37):
// the linted test file itself — exact names pass, wrong case,
// re-splits, and orphans fail. Companion-scan tests (steps files,
// snapshots, exemptions) live in testColocationScan.test.ts.

test('test-colocation: exact-name colocated test passes', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.tsx': SOURCE},
    ['BananaMan.test.tsx'],
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: exact-name e2e test passes', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.e2e.tsx': SOURCE},
    ['BananaMan.test.e2e.tsx'],
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: wrong-case test base fails', async () => {
  const messages = await colocationMessages(
    {'BananaMan.tsx': SOURCE, 'bananaman.test.tsx': SOURCE},
    ['bananaman.test.tsx'],
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0]?.message ?? '', /bananaman/u);
});

test('test-colocation: hyphen/underscore re-split test base fails', async () => {
  for (const name of ['Banana_Man.test.tsx', 'Banana-Man.test.tsx']) {
    const messages = await colocationMessages(
      {'BananaMan.tsx': SOURCE, [name]: SOURCE},
      [name],
    );
    assert.equal(messages.length, 1, `${name} should be flagged`);
  }
});

test('test-colocation: orphan test file fails', async () => {
  const messages = await colocationMessages(
    {'Other.tsx': SOURCE, 'BananaMan.test.tsx': SOURCE},
    ['BananaMan.test.tsx'],
  );
  assert.equal(messages.length, 1);
});

test('test-colocation: a parent directory named test above the cwd does not exempt', async () => {
  const messages = await colocationMessages(
    {
      'test/proj/BananaMan.tsx': SOURCE,
      'test/proj/bananaman.test.tsx': SOURCE,
    },
    ['test/proj/bananaman.test.tsx'],
    'test/proj',
  );
  assert.equal(messages.length, 1);
});
