# @spudly/tooling

## 0.2.0

### Minor Changes

- f47ece8: Add `@spudly/tooling`, the shared developer-tooling package for the
  Spudly repos: affected-test discovery primitives (changed file to its
  colocated test files and affected workspaces), the standard
  actionlint invocation for changed workflow files, and a
  `check-drift` command that verifies a consumer repo carries the
  common check contract's required scripts and hook stages, failing
  with a named list of what is missing. This repo now dogfoods the
  contract names itself.
