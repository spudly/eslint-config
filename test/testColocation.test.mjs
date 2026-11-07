import assert from 'node:assert/strict';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';

import {ESLint} from 'eslint';

import {base} from '../dist/index.js';

// Integration tests for test-colocation/exact-base-name (issue #37).
// The rule reads the filesystem, so — in the style of
// ts7Consumer.test.mjs — these tests build real fixture trees in a
// temporary directory and run the real ESLint class over them,
// asserting only on this rule's messages.

const RULE = 'test-colocation/exact-base-name';
const SOURCE = 'export const value = 1;\n';

async function lintTree(files, target) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'test-colocation-'));
  try {
    for (const [relative, content] of Object.entries(files)) {
      const full = path.join(root, relative);
      await mkdir(path.dirname(full), {recursive: true});
      await writeFile(full, content);
    }
    const eslint = new ESLint({
      cwd: root,
      overrideConfig: base,
      overrideConfigFile: true,
    });
    const [result] = await eslint.lintFiles([path.join(root, target)]);
    return result.messages.filter(message => message.ruleId === RULE);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
}

test('test-colocation: exact-name colocated test passes', async () => {
  const messages = await lintTree(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.tsx': SOURCE},
    'BananaMan.test.tsx',
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: exact-name e2e test passes', async () => {
  const messages = await lintTree(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.e2e.tsx': SOURCE},
    'BananaMan.test.e2e.tsx',
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: wrong-case test base fails', async () => {
  const messages = await lintTree(
    {'BananaMan.tsx': SOURCE, 'bananaman.test.tsx': SOURCE},
    'bananaman.test.tsx',
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0].message, /bananaman/u);
});

test('test-colocation: hyphen/underscore re-split test base fails', async () => {
  for (const name of ['Banana_Man.test.tsx', 'Banana-Man.test.tsx']) {
    const messages = await lintTree(
      {'BananaMan.tsx': SOURCE, [name]: SOURCE},
      name,
    );
    assert.equal(messages.length, 1, `${name} should be flagged`);
  }
});

test('test-colocation: orphan test file fails', async () => {
  const messages = await lintTree(
    {'Other.tsx': SOURCE, 'BananaMan.test.tsx': SOURCE},
    'BananaMan.test.tsx',
  );
  assert.equal(messages.length, 1);
});

test('test-colocation: misnamed manual test steps fail from the source sibling', async () => {
  const messages = await lintTree(
    {
      'BananaMan.tsx': SOURCE,
      'Banana_Man.test.steps.md': '# steps\n',
    },
    'BananaMan.tsx',
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0].message, /Banana_Man\.test\.steps\.md/u);
});

test('test-colocation: exact-name manual test steps pass from the source sibling', async () => {
  const messages = await lintTree(
    {'BananaMan.tsx': SOURCE, 'BananaMan.test.steps.md': '# steps\n'},
    'BananaMan.tsx',
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: snapshot starting with the exact base passes', async () => {
  const messages = await lintTree(
    {
      'BananaMan.tsx': SOURCE,
      '__snapshots__/BananaMan--variant--othervariant.png': 'png',
      '__snapshots__/BananaMan-chromium.png': 'png',
    },
    'BananaMan.tsx',
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: snapshot not starting with a sibling base fails', async () => {
  const messages = await lintTree(
    {
      'BananaMan.tsx': SOURCE,
      '__snapshots__/Other--variant.png': 'png',
    },
    'BananaMan.tsx',
  );
  assert.equal(messages.length, 1);
  assert.match(messages[0].message, /Other--variant\.png/u);
});

test('test-colocation: a source file without tests is not flagged', async () => {
  const messages = await lintTree({'BananaMan.tsx': SOURCE}, 'BananaMan.tsx');
  assert.deepEqual(messages, []);
});

test('test-colocation: helpers in a dedicated test/ folder are exempt', async () => {
  const messages = await lintTree(
    {'test/helper.test.ts': SOURCE},
    'test/helper.test.ts',
  );
  assert.deepEqual(messages, []);
});

test('test-colocation: an orphan companion is reported once per directory, not once per source file', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'test-colocation-'));
  try {
    await writeFile(path.join(root, 'Apple.tsx'), SOURCE);
    await writeFile(path.join(root, 'BananaMan.tsx'), SOURCE);
    await writeFile(path.join(root, 'Banana_Man.test.steps.md'), '# steps\n');
    const eslint = new ESLint({
      cwd: root,
      overrideConfig: base,
      overrideConfigFile: true,
    });
    const results = await eslint.lintFiles([
      path.join(root, 'Apple.tsx'),
      path.join(root, 'BananaMan.tsx'),
    ]);
    const messages = results.flatMap(result =>
      result.messages.filter(message => message.ruleId === RULE),
    );
    assert.equal(messages.length, 1);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('test-colocation: a parent directory named test above the cwd does not exempt', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'test-colocation-'));
  try {
    const project = path.join(root, 'test', 'proj');
    await mkdir(project, {recursive: true});
    await writeFile(path.join(project, 'BananaMan.tsx'), SOURCE);
    await writeFile(path.join(project, 'bananaman.test.tsx'), SOURCE);
    const eslint = new ESLint({
      cwd: project,
      overrideConfig: base,
      overrideConfigFile: true,
    });
    const [result] = await eslint.lintFiles([
      path.join(project, 'bananaman.test.tsx'),
    ]);
    const messages = result.messages.filter(message => message.ruleId === RULE);
    assert.equal(messages.length, 1);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('test-colocation: non-test fixtures under __tests__/ are untouched', async () => {
  const messages = await lintTree(
    {'BananaMan.tsx': SOURCE, '__tests__/fixture.ts': SOURCE},
    'BananaMan.tsx',
  );
  assert.deepEqual(messages, []);
});
