#!/usr/bin/env tsx
/**
 * spudly-tooling CLI (issue #49, tranche 3).
 *
 * - `affected-tests [--staged] [files...]` — print the colocated test
 *   files affected by the changed files, one per line, for the
 *   consumer's own test runner.
 * - `actionlint [files...]` — run the standard actionlint invocation
 *   over the workflow files among the given (or staged) files. Files
 *   outside .github/workflows/ are ignored; when the actionlint binary
 *   is not installed, warn and succeed so a hook never blocks on a
 *   missing optional binary.
 * - `check-drift [root]` — verify a repo carries the common check
 *   contract; exit 1 with the named missing pieces when it does not.
 *
 * Written in TypeScript and run through tsx (the package's bin entry),
 * so there is no build step.
 */
import {spawnSync} from 'node:child_process';

import {
  actionlintInvocation,
  checkDriftForRepo,
  findAffectedTests,
} from './index.ts';

function git(args: string[]): string[] {
  const result = spawnSync('git', args, {encoding: 'utf8'});
  return result.status === 0 ? result.stdout.split('\n').filter(Boolean) : [];
}

const [command, ...rest] = process.argv.slice(2);
const staged = rest.includes('--staged');
const files = rest.filter(arg => !arg.startsWith('--'));
const changedFiles =
  files.length > 0
    ? files
    : staged
      ? git(['diff', '--cached', '--name-only'])
      : [];

switch (command) {
  case 'affected-tests': {
    const existingFiles = git(['ls-files']);
    for (const testFile of findAffectedTests(changedFiles, existingFiles)) {
      console.log(testFile);
    }

    break;
  }
  case 'actionlint': {
    const invocation = actionlintInvocation(changedFiles);
    if (invocation) {
      const result = spawnSync(invocation.command, invocation.args, {
        stdio: 'inherit',
      });
      const errorCode = (result.error as NodeJS.ErrnoException | undefined)
        ?.code;
      if (errorCode === 'ENOENT') {
        console.warn(
          'actionlint is not installed; skipping the workflow lint stage.',
        );
      } else {
        process.exit(result.status ?? 1);
      }
    }

    break;
  }
  case 'check-drift': {
    const missing = checkDriftForRepo(files[0] ?? process.cwd());
    if (missing.length > 0) {
      console.error(`Standards drift: missing ${missing.join('; ')}.`);
      process.exit(1);
    }
    console.log('No standards drift: the common check contract is present.');

    break;
  }
  default: {
    console.error(
      'Usage: spudly-tooling <affected-tests|actionlint|check-drift> [--staged] [files...]',
    );
    process.exit(2);
  }
}
