# @spudly/eslint-config

## 0.2.0

### Minor Changes

- 6c413a8: The @eslint-react rules are temporarily disabled pending TypeScript 7
  compatibility, mirroring the typescript-eslint treatment. In 0.1.0 the
  `react` export crashed on load for every TypeScript 7 consumer:
  @eslint-react's plugin chain (eslint-plugin-react-x -> ts-api-utils)
  reads `ts.TypeFlags` at module init, which TypeScript 7 does not
  expose (issue #8). The full @eslint-react configuration — every rule,
  severity, and rationale comment, preserved verbatim — moves out of
  `react` into a new subpath-only export, `reactPending`
  (`@spudly/eslint-config/react-pending`), which no consumer composes
  yet; it is deliberately not re-exported from the package root, so
  root imports stay loadable under TypeScript 7. The `react` export
  still ships the eslint-plugin-react-hooks rules. When an upstream
  @eslint-react release adds TypeScript 7 compatibility, the pending
  block folds back into `react` and the rules return with a normal
  release — guarded by a new TypeScript 7 consumer-fixture test that
  installs the packed package next to typescript@^7 and asserts the
  composed exports load and lint there.

## 0.1.0

### Minor Changes

- 57e1ec2: Initial release (0.1.0): a shared ESLint 10 flat config for Eciperay,
  Memorize, and the design system, ported from Eciperay's
  eslint.config.ts with a deliberately small export surface — `base`
  (core rules + import-x + unicorn + CommonJS overrides +
  eslint-comments + the coverage-ignore custom rule + Prettier),
  `react` (rebuilt on @eslint-react/eslint-plugin, the ESLint
  10-compatible successor path for eslint-plugin-react, which has no
  ESLint 10 release), `reactNative` (rules vendored from
  eslint-plugin-react-native 5.0.0, MIT, and adapted to ESLint 10 APIs),
  `node` (eslint-plugin-n, rules only — consumers attach their own
  server paths), `jest`, `tailwind`, and `typescriptPendingIgnores` for
  the interim period until typescript-eslint supports TypeScript 7.
  The package bakes in no repo directory layout: scoped rule groups
  carry rules only, and each consuming repo attaches its own `files:`
  globs.

### Patch Changes

- 6e87f54: Add the `check-rules` config-currency audit (issue #2): a script that
  reports deprecated, removed/unknown, and missing rules across the
  composed config and exits non-zero on any finding, plus the first
  audit's resolutions — 118 deprecated/removed entries deleted (all
  'off', so no behavior change) and three deprecated unicorn rules
  migrated to their successors at 'error' (no-array-push-push →
  prefer-single-call, no-instanceof-array → no-instanceof-builtins,
  no-length-as-slice-end → no-unnecessary-slice-end; successors cover
  more cases). The audit runs clean after this change.
