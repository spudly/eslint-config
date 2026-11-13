#!/usr/bin/env node
/**
 * runTests — the `npm test` entry point.
 *
 * The package is TypeScript source (Stephen's direction on PRs
 * #51/#53): tsx runs the tests straight from test/*.test.ts. The
 * published package is tsc-built (prepack emits dist/), so only
 * the tests run from source. The
 * test-file selection (top level
 * of test/, sorted) is reproduced with readdir so it is identical on
 * every platform.
 *
 * A local run passes --test-concurrency=2 (Stephen's direction,
 * 2026-11-10: the node --test default oversubscribes constrained
 * environments); when the CI environment variable is set, the flag is
 * omitted and CI keeps its default parallelism.
 *
 * tsx is invoked as its JavaScript entry point under the current
 * node (process.execPath), which sidesteps the node_modules/.bin
 * shim on every platform. Exit codes propagate.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, readdirSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const testFiles = readdirSync(path.join(root, 'test'))
  .filter(name => name.endsWith('.test.ts'))
  .sort()
  .map(name => path.join('test', name));
if (testFiles.length === 0) {
  process.stderr.write('runTests: no test/*.test.ts files found.\n');
  process.exit(1);
}

// tsx is a devDependency of this package, but npm workspaces hoist it
// to the monorepo root's node_modules, so walk up from this package
// until a node_modules/tsx is found instead of assuming it is local.
function findTsxCli(start) {
  for (let dir = start; ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    if (existsSync(candidate)) return candidate;
    if (path.dirname(dir) === dir) break;
  }
  throw new Error(
    `runTests: could not locate tsx (node_modules/tsx/dist/cli.mjs) at or above ${
      start
    }`,
  );
}
const tsxCli = findTsxCli(root);
const args = [tsxCli, '--test'];
if (!process.env.CI) args.push('--test-concurrency=2');
args.push(...testFiles);
const result = spawnSync(process.execPath, args, {cwd: root, stdio: 'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
