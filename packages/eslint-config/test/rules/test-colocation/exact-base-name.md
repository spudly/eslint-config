# Rule: test-colocation/exact-base-name

## Rule Description

Requires test files to be colocated with the file they test and to share its exact base name — case unchanged, with no underscores or hyphens added to split words — covering unit tests (`.test.<ext>`), e2e tests (`.test.e2e.<ext>`), manual test steps (`.test.steps.md`), stories (`.stories.<ext>`), and snapshot files in a colocated `__snapshots__/` directory whose names start with the tested file's base name.

## Configuration

```js
{
  // ...
  'test-colocation/exact-base-name': 'warn',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule reads the linted file's real directory from disk: whether a test companion is orphaned depends on which sibling files exist on disk, not on the linted file's contents. Both snippets of a fixture are linted as in-memory text under the one filename in its Test setup, so no snippet can supply the sibling files the Bad case needs to be missing (or the Good case needs to be present). Real behavior is covered by the on-disk integration tests in `test/testColocation.test.mjs`, which build temporary fixture trees and run the real ESLint class over them.
