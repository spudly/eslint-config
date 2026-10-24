# @spudly/eslint-config

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
