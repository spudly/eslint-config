/**
 * @spudly/tooling — shared developer-tooling primitives for the Spudly
 * repos (issue #49, tranche 3).
 *
 * Everything here returns data; the consumer's own runner decides what
 * to execute. Per-repo package graphs, test runners, and test commands
 * stay in each consumer — this package only knows the common check
 * contract from the #49 epic: script names, hook stages, the standard
 * actionlint invocation, and affected-test discovery by colocation.
 */
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const TEST_FILE_PATTERN = /\.(?:test|spec)\.[^.]+$/;
const WORKFLOW_PATTERN = /^\.github\/workflows\/[^/]+\.ya?ml$/;

/** Scripts every consumer repo must expose under the common contract. */
export const REQUIRED_SCRIPTS = ['precommit:affected-tests'];

/** Hook stages every consumer repo must carry, by hook file name. */
export const REQUIRED_HOOK_STAGES = {
  'commit-msg': ['commitlint'],
  'pre-commit': ['lint-staged'],
};

export function isTestFile(file) {
  return TEST_FILE_PATTERN.test(file);
}

export function isWorkflowFile(file) {
  return WORKFLOW_PATTERN.test(file);
}

/** The standard actionlint invocation for the given files, or null. */
export function actionlintInvocation(files) {
  const workflows = files.filter(file => isWorkflowFile(file));
  if (workflows.length === 0) {
    return null;
  }
  return {args: workflows, command: 'actionlint'};
}

/**
 * Affected-test discovery: for each changed file, the colocated test
 * files (same directory, same base name, `*.test.*` / `*.spec.*`) that
 * exist in `existingFiles`. A changed test file affects itself.
 */
export function findAffectedTests(changedFiles, existingFiles) {
  const existing = new Set(existingFiles);
  const affected = new Set();
  for (const file of changedFiles) {
    if (isTestFile(file)) {
      if (existing.has(file)) {
        affected.add(file);
      }
      continue;
    }
    const dot = file.lastIndexOf('.');
    const base = dot === -1 ? file : file.slice(0, dot);
    for (const candidate of existing) {
      if (
        isTestFile(candidate) &&
        candidate.slice(0, candidate.search(TEST_FILE_PATTERN)) === base
      ) {
        affected.add(candidate);
      }
    }
  }
  return [...affected].sort();
}

/** Workspace directories (`packages/<name>`) touched by the changes. */
export function affectedWorkspaces(changedFiles) {
  const workspaces = new Set();
  for (const file of changedFiles) {
    const match = /^(packages\/[^/]+)\//.exec(file);
    if (match) {
      workspaces.add(match[1]);
    }
  }
  return [...workspaces].sort();
}

/**
 * Standards drift check over already-read repo state. Returns the list
 * of missing contract pieces (empty = no drift): required scripts,
 * required hook stages, and an actionlint stage in the lint-staged
 * configuration.
 */
export function checkDrift({hooks = {}, packageJson = {}}) {
  const missing = [];
  const scripts = packageJson.scripts ?? {};
  for (const script of REQUIRED_SCRIPTS) {
    if (!(script in scripts)) {
      missing.push(`script "${script}"`);
    }
  }
  const stagedCommands = Object.values(packageJson['lint-staged'] ?? {}).flat();
  if (!stagedCommands.some(command => command.includes('actionlint'))) {
    missing.push('an actionlint stage in the lint-staged config');
  }
  for (const [hook, stages] of Object.entries(REQUIRED_HOOK_STAGES)) {
    const content = hooks[hook];
    if (content === null || content === undefined) {
      missing.push(`the .husky/${hook} hook`);
      continue;
    }
    for (const stage of stages) {
      if (!content.includes(stage)) {
        missing.push(`the "${stage}" stage in .husky/${hook}`);
      }
    }
  }
  return missing;
}

/** Read a repo from disk and run the drift check against it. */
export function checkDriftForRepo(root) {
  const packageJsonPath = join(root, 'package.json');
  const packageJson = existsSync(packageJsonPath)
    ? JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    : {};
  const hooks = {};
  for (const hook of Object.keys(REQUIRED_HOOK_STAGES)) {
    const hookPath = join(root, '.husky', hook);
    hooks[hook] = existsSync(hookPath) ? readFileSync(hookPath, 'utf8') : null;
  }
  return checkDrift({hooks, packageJson});
}
