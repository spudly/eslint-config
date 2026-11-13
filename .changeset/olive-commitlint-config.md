---
'@spudly/commitlint-config': minor
---

Add `@spudly/commitlint-config`, the shared commitlint base for the
Spudly repos: it wraps `@commitlint/config-conventional`, so consumers
extend one shared conventional-commit contract and layer only their
repo-specific rules (such as commit scopes) locally. This repo now
dogfoods it via its root commitlint config and a commit-msg hook.
