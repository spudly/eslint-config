# Spudly tooling monorepo

This repository is the shared developer-tooling monorepo for the Spudly
repos (eciperay, memorize, design-system, and this repo) — issue #49.
It keeps its GitHub name (`eslint-config`) for now; the packages inside
it are independently versioned and published via Changesets to GitHub
Packages.

## Packages

- [`@spudly/eslint-config`](packages/eslint-config/README.md) — the
  shared ESLint 10 flat config, in `packages/eslint-config/`.
- [`@spudly/commitlint-config`](packages/commitlint-config/README.md) —
  the shared commitlint base (wraps `@commitlint/config-conventional`),
  in `packages/commitlint-config/`; this repo dogfoods it via
  `commitlint.config.cjs` and the `.husky/commit-msg` hook.
- `@spudly/tooling` arrives in a later tranche of #49.

## Working in this repo

Root scripts delegate to the workspaces:

```sh
npm ci
npm run build
npm run typecheck
npm test
npm run lint
npm run check-rules
```

Releases run through Changesets from the root, exactly as before the
restructure; consumers of `@spudly/eslint-config` upgrade with no
import changes.
