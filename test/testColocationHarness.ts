import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {ESLint} from 'eslint';

import {base} from '../dist/index.js';

// Shared harness for the test-colocation integration tests (issue
// #37): builds a real fixture tree in a temporary directory and runs
// the real ESLint class over the given targets, returning only the
// test-colocation/exact-base-name messages. `cwdSubdir` selects the
// ESLint working directory inside the tree (default: the tree root).
export const RULE = 'test-colocation/exact-base-name';
export const SOURCE = 'export const value = 1;\n';

export async function colocationMessages(
  files: Record<string, string>,
  targets: string[],
  cwdSubdir = '',
) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'test-colocation-'));
  try {
    for (const [relative, content] of Object.entries(files)) {
      const full = path.join(root, relative);
      await mkdir(path.dirname(full), {recursive: true});
      await writeFile(full, content);
    }
    const eslint = new ESLint({
      cwd: path.join(root, cwdSubdir),
      overrideConfig: base,
      overrideConfigFile: true,
    });
    const results = await eslint.lintFiles(
      targets.map(target => path.join(root, target)),
    );
    return results.flatMap(result =>
      result.messages.filter(message => message.ruleId === RULE),
    );
  } finally {
    await rm(root, {recursive: true, force: true});
  }
}
