# @spudly/eslint-config

## 0.3.0

### Minor Changes

- 26d8657: The issue #4 evaluation of the @eslint-react rules is complete: all 42
  rules that were held `'off'` as undecided in the `reactPending` export
  are now decided. Each was trialled as `'error'` against the design
  system's `src/` tree (41 reported zero findings; `immutability`'s four
  findings are a single design-system site, filed as
  spudly/design-system#135 to refactor before restoration). 39 are now
  `'error'` in `reactPending`, with the trial result recorded on each
  entry. The three type-requiring rules (`no-implicit-children`,
  `no-implicit-key`, `no-implicit-ref`) stay `'off'` with a recorded
  rationale: enabling them crashes lint runs that have no typed parser
  setup, and no consumer runs typed linting today — they are flagged
  for re-evaluation at restoration (issue #8), when typed linting
  exists.

  Hooks-source decision, also recorded in the source: the classic hooks
  rules stay with eslint-plugin-react-hooks (`@eslint-react`'s
  `rules-of-hooks`/`exhaustive-deps` stay `'off'`), and for the React
  Compiler diagnostics that exist under both namespaces, the
  @eslint-react versions are the single source — the react-hooks
  duplicates in the `react` export stay `'off'` by decision so nothing
  double-reports when `reactPending` is restored.

  No consumer's effective config changes today: `reactPending` is still
  composed nowhere (restoration remains tracked by issue #8), and the
  composed exports are untouched.

### Patch Changes

- 1a4af18: Source-only cleanup with no behavior change: four unicorn rules are now
  explicitly `'off'` in the unicorn block instead of `'error'`.

  `unicorn/empty-brace-spaces`, `unicorn/no-nested-ternary`,
  `unicorn/number-literal-case`, and `unicorn/template-indent` were set to
  `'error'` at the source, but the eslint-config-prettier block composed
  last in `base` already turned every one of them off — so the effective
  config consumers receive has always had them off, while the source
  read as if they were on. Each entry is now `'off'` with a rationale
  comment, so the source matches the effective config.

  The effective config is unchanged, verified by composing every export
  (`base`, `jest`, `node`, `react`, `reactNative`, `tailwind`,
  `typescriptPendingIgnores`, `reactPending`) through ESLint's
  `calculateConfigForFile` over probe filenames before and after the
  change: the full rule sets are identical for every export.

- 54d3b31: Test-only change (no published files change — the tarball ships only
  `dist`): the behavior tests are now markdown-driven. Every enabled
  rule has one markdown file under `test/rules/` that serves as its
  documentation and its behavior fixture at the same time (description,
  the rule's configured entry, and Bad/Good snippets linted with the
  real ESLint class under the composed export). A strict, dependency-
  free parser plus a data-driven harness replace the seven hand-written
  behavior tests from the Option A suite; a coverage test enumerates
  every enabled rule across all exports and fails if one lacks a
  fixture, so the weekly check-rules flow now demands a fixture and
  doc for every newly enabled rule. Rules no snippet can honestly
  trigger document why in a Not snippet-testable section and are
  reported as documented skips. Composition and smoke tests are
  unchanged; no rule or export behavior changes.
- e4d1af6: Test-only change (no published files change — the tarball ships only
  `dist`): implement the Option A testing strategy from issue #3. The
  suite gains XO-style behavior fixtures for the high-value rule groups
  (one per export), targeted composition assertions (plugin
  registrations, the groups folded into `base`, fold ordering, the
  Prettier block last — no full snapshots), and an airbnb-style consumer
  smoke covering every export in `package.json`. Completeness auditing
  stays with `check-rules`; no rule or export behavior changes.

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
