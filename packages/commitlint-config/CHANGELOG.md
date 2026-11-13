# @spudly/commitlint-config

## 0.2.0

### Minor Changes

- 69f1055: Add `@spudly/commitlint-config`, the shared commitlint base for the
  Spudly repos: it wraps `@commitlint/config-conventional`, so consumers
  extend one shared conventional-commit contract and layer only their
  repo-specific rules (such as commit scopes) locally. This repo now
  dogfoods it via its root commitlint config and a commit-msg hook.
