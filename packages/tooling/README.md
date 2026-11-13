# @spudly/tooling

Shared developer-tooling primitives and CLI for the Spudly repos,
implementing the common check contract from the tooling-monorepo epic:
every repo exposes the same script names, hook stages, and workflow
lint invocation, and repo-specific runners stay in each consumer.

## Primitives (`@spudly/tooling`)

All primitives return data — the consumer's own runner decides what
to execute.

- `findAffectedTests(changedFiles, existingFiles)` — affected-test
  discovery by colocation: a changed file maps to its same-directory,
  same-base-name `*.test.*` / `*.spec.*` files; a changed test file
  affects itself.
- `affectedWorkspaces(changedFiles)` — the `packages/<name>`
  directories touched by the changes.
- `actionlintInvocation(files)` — the standard actionlint invocation
  (`{command, args}`) over just the `.github/workflows/*.yml|yaml`
  files, or `null` when none changed.
- `checkDrift({packageJson, hooks})` / `checkDriftForRepo(root)` —
  the standards drift check: the named list of contract pieces a repo
  is missing (required scripts, hook stages, the actionlint stage),
  empty when the repo carries the full contract.

## CLI (`spudly-tooling`)

```sh
spudly-tooling affected-tests --staged   # print affected test files
spudly-tooling actionlint --staged       # lint staged workflow files
spudly-tooling check-drift               # fail on standards drift
```

The contract every consumer carries:

- a `precommit:affected-tests` script backed by the discovery
  primitive,
- a lint-staged stage running the actionlint invocation for workflow
  files,
- a husky `pre-commit` hook running lint-staged and a `commit-msg`
  hook running commitlint.

`check-drift` exits non-zero and names each missing piece, so a
consumer can run it in CI and fail loudly instead of drifting.
