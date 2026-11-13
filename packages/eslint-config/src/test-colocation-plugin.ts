import fs from 'node:fs';
import path from 'node:path';
import type {ESLint} from 'eslint';

/**
 * The `test-colocation` plugin — enforces Stephen's test-file
 * convention (2026-11-07, issue #37): a test file is colocated with
 * the file it tests and shares its exact base name, case unchanged,
 * with no underscores or hyphens added to re-split words.
 *
 * For a module `BananaMan.tsx`, the sanctioned companions are:
 *   - `BananaMan.test.tsx` (unit tests)
 *   - `BananaMan.test.e2e.tsx` (e2e tests)
 *   - `BananaMan.test.steps.md` (manual test steps)
 *   - `BananaMan.stories.tsx` (stories count as test files)
 *   - `__snapshots__/BananaMan--variant.png` and other snapshot files
 *     whose names start with `BananaMan` (tool-appended suffixes such
 *     as Playwright's `-chromium` are acceptable)
 *
 * The rule only flags orphan or misnamed companions; it never
 * requires a source file to have a test. Files under a dedicated
 * `test/` directory are exempt: shared test helpers live there by
 * design (Stephen's ruling, 2026-11-07) and are not colocated tests.
 * Non-test fixture files under `__tests__/` are untouched; a `.test.*`
 * file inside `__tests__/` is not colocated and is flagged.
 *
 * `.test.steps.md` files and snapshot images are never linted, so no
 * rule running on them could ever fire: they are enforced from a
 * linted source sibling, which scans its own directory (and a sibling
 * `__snapshots__/` directory) and reports companions whose base name
 * matches no sibling source file.
 */

const SOURCE_EXTENSIONS = new Set(['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs']);
const TEST_FILE = /^(.+)\.test(?:\.e2e)?\.([^.]+)$/u;
const STORIES_FILE = /^(.+)\.stories\.([^.]+)$/u;
const STEPS_FILE = /^(.+)\.test\.steps\.md$/u;

type DirectoryListing = {
  files: string[];
  snapshotFiles: string[];
};

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot === -1 ? '' : fileName.slice(dot + 1);
}

function isTestLike(fileName: string): boolean {
  return TEST_FILE.test(fileName) || STORIES_FILE.test(fileName);
}

/** Base name of a source file, or null when the file is not a source file. */
function sourceBaseOf(fileName: string): string | null {
  if (isTestLike(fileName) || STEPS_FILE.test(fileName)) return null;
  if (!SOURCE_EXTENSIONS.has(extensionOf(fileName))) return null;
  return fileName.slice(0, fileName.length - extensionOf(fileName).length - 1);
}

/** Base a companion file claims to test, or null when it is not a companion. */
function companionBaseOf(fileName: string): string | null {
  const steps = STEPS_FILE.exec(fileName);
  if (steps?.[1] !== undefined) return steps[1];
  const test = TEST_FILE.exec(fileName);
  if (test?.[1] !== undefined && SOURCE_EXTENSIONS.has(test[2] ?? '')) {
    return test[1];
  }
  const stories = STORIES_FILE.exec(fileName);
  if (stories?.[1] !== undefined && SOURCE_EXTENSIONS.has(stories[2] ?? '')) {
    return stories[1];
  }
  return null;
}

function readListing(directory: string): DirectoryListing | null {
  try {
    const files = fs
      .readdirSync(directory, {withFileTypes: true})
      .filter(entry => entry.isFile())
      .map(entry => entry.name);
    let snapshotFiles: string[] = [];
    try {
      snapshotFiles = fs
        .readdirSync(path.join(directory, '__snapshots__'), {
          withFileTypes: true,
        })
        .filter(entry => entry.isFile())
        .map(entry => entry.name);
    } catch {
      snapshotFiles = [];
    }
    return {files, snapshotFiles};
  } catch {
    return null;
  }
}

function snapshotMatches(fileName: string, sourceBases: Set<string>): boolean {
  for (const base of sourceBases) {
    if (fileName === base) return true;
    if (
      fileName.startsWith(base) &&
      (fileName[base.length] === '-' || fileName[base.length] === '.')
    ) {
      return true;
    }
  }
  return false;
}

const testColocationPlugin: ESLint.Plugin = {
  rules: {
    'exact-base-name': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Require test files to be colocated with the file they test and share its exact base name',
        },
        messages: {
          orphanTest:
            "Test file '{{file}}' has no sibling source file with the exact base name '{{base}}'. Test files must be colocated with the file they test and share its exact base name (case unchanged, no added underscores or hyphens).",
          orphanCompanion:
            "Companion file '{{file}}' has no sibling source file with the exact base name '{{base}}'. Test companions must be colocated with the file they test and share its exact base name (case unchanged, no added underscores or hyphens).",
          orphanSnapshot:
            "Snapshot file '{{file}}' does not start with the exact base name of any sibling source file. Snapshot files must live in a colocated '__snapshots__' directory and start with the name of the file they test.",
        },
        schema: [],
      },
      create(context) {
        return {
          Program(node) {
            const filename = context.physicalFilename ?? context.filename;
            if (!filename || !path.isAbsolute(filename)) return;
            const directory = path.dirname(filename);
            // Shared test helpers live in a dedicated `test/` folder by
            // design and are not colocated tests (Stephen, 2026-11-07).
            // Only path segments below the ESLint working directory
            // count: a checkout that happens to sit under a parent
            // directory named `test` must not disable the rule.
            const relativeDirectory = path.relative(context.cwd, directory);
            if (relativeDirectory.split(path.sep).includes('test')) return;
            const listing = readListing(directory);
            if (!listing) return;
            const sourceBases = new Set(
              listing.files
                .map(sourceBaseOf)
                .filter((base): base is string => base !== null),
            );
            const ownName = path.basename(filename);
            const ownBase = companionBaseOf(ownName);
            if (ownBase !== null) {
              // The linted file is itself a test companion: it must
              // name a sibling source file exactly.
              if (!sourceBases.has(ownBase)) {
                context.report({
                  node,
                  messageId: 'orphanTest',
                  data: {file: ownName, base: ownBase},
                });
              }
              return;
            }
            if (sourceBaseOf(ownName) === null) return;
            // The linted file is a source file: enforce the companions
            // that are never linted themselves (manual test steps and
            // snapshot images), plus any misnamed test companion. One
            // deterministic reporter per directory — the alphabetically
            // first source file — so an orphan companion is reported
            // once, not once per source file in the directory.
            const [firstSource] = listing.files
              .filter(file => sourceBaseOf(file) !== null)
              .sort();
            if (firstSource !== ownName) return;
            for (const file of listing.files) {
              if (file === ownName) continue;
              const base = companionBaseOf(file);
              if (base !== null && !sourceBases.has(base)) {
                context.report({
                  node,
                  messageId: 'orphanCompanion',
                  data: {file, base},
                });
              }
            }
            for (const file of listing.snapshotFiles) {
              if (!snapshotMatches(file, sourceBases)) {
                context.report({
                  node,
                  messageId: 'orphanSnapshot',
                  data: {file},
                });
              }
            }
          },
        };
      },
    },
  },
};

export default testColocationPlugin;
