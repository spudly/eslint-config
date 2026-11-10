#!/usr/bin/env node
/**
 * runTests — the `npm test` entry point.
 *
 * Two steps, exactly what the old one-line script did:
 *   1. `npm run build` — the tests are packaging tests: they import the
 *      built package from dist/, so the build is part of the test run.
 *      The tests themselves are never precompiled; tsx runs them from
 *      test/*.test.ts source (Stephen's standing rule).
 *   2. `tsx --test test/*.test.ts` — the same file selection the shell
 *      glob produced (top level of test/, sorted), reproduced here with
 *      readdir so the selection is identical on every platform.
 *
 * The one behavioral difference (Stephen's direction, 2026-11-10): a
 * local run passes --test-concurrency=2. The node --test default runs
 * one test file process per available core, which oversubscribes
 * constrained environments — a small VM ends up slower and flakier
 * than a capped run. CI runners have real cores to spare, so when the
 * CI environment variable is set (GitHub Actions sets it) the flag is
 * omitted and CI keeps its default parallelism.
 *
 * Windows: `npm` is a .cmd shim there, which a shell-free spawnSync
 * cannot execute, so the build step goes through the shell on win32
 * (its arguments are fixed literals). tsx is invoked as its JavaScript
 * entry point under the current node (process.execPath), which
 * sidesteps the node_modules/.bin shim on every platform.
 *
 * Exit codes propagate: a failed build or a failed test run exits
 * non-zero with the child's status.
 */
import {spawnSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, {shell = false} = {}) {
  const result = spawnSync(command, args, {cwd: root, stdio: 'inherit', shell});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npm', ['run', 'build'], {shell: process.platform === 'win32'});

const testFiles = readdirSync(path.join(root, 'test'))
  .filter(name => name.endsWith('.test.ts'))
  .sort()
  .map(name => path.join('test', name));
if (testFiles.length === 0) {
  process.stderr.write('runTests: no test/*.test.ts files found.\n');
  process.exit(1);
}

const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const args = [tsxCli, '--test'];
if (!process.env.CI) args.push('--test-concurrency=2');
args.push(...testFiles);
run(process.execPath, args);
