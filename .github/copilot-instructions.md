# Copilot instructions — @spudly/eslint-config

This repo is a shared ESLint 10 flat config (`@spudly/eslint-config`)
consumed by the other Spudly repos. When reviewing pull requests here,
apply the conventions below: flag violations of them, do not flag code
that follows them, and do not suggest patterns that contradict them.

## Export discipline

- The public export list stays small on purpose: `base`, `react`,
  `reactNative`, `jest`, `tailwind`, `typescriptPendingIgnores`, `node`
  (see `src/index.ts`). Flag PRs that add new top-level exports for rule
  groups that belong inside `base` — import-x, unicorn, the CommonJS
  overrides, and the coverage-ignore rule already fold into `base`.
- `reactPending` (`src/react-pending.ts`) exists only as the subpath
  export `@spudly/eslint-config/react-pending`. While the TypeScript 7
  hold lasts, it must not be re-exported from `src/index.ts` or folded
  into `react`. The one exception is the documented restoration: once a
  TypeScript 7-compatible `@eslint-react` release is proven by the TS7
  consumer fixture (`test/ts7Consumer.test.ts`), folding it into
  `react` and deleting the `./react-pending` subpath export is the
  planned restoration, not a violation (see the restore path in
  `src/react-pending.ts`).

## No path overrides in the shared config

- Flag any `files:` globs or other directory-layout scoping added to
  config blocks in this package. Rule groups that need directory scoping
  ship as rules-only exports, and each consuming repo attaches its own
  `files:` globs. Scoping that is intrinsic to a rule itself
  (extension/language matching) may stay.

## Rules that do not belong here

- Flag any attempt to add a "no className outside components" rule (or a
  similar className/style-prop restriction) to this package. That rule
  lives in the design-system repo, not in the shared config.

## TypeScript 7 holds

- `typescript-eslint` and the `@eslint-react` chain are disabled because
  they do not support TypeScript 7 yet. Flag PRs that re-enable them in
  active exports before upstream TS7 support lands.
- The `@eslint-react` rules are preserved in `src/react-pending.ts`.
  Flag any edit that alters the preserved rule set or moves those rules
  into `react` or another active export — with two exceptions:
  audit-driven currency updates from the check-rules script (removing
  deprecated rules, adding explicit entries for new ones) are required
  maintenance, not drift; and the documented restoration above may move
  the rules into `react` once the TS7 condition is met.

## Rule currency

- Deprecated/removed and new/missing rules are tracked by the
  rule-currency audit (`scripts/checkRules.mjs`, run via
  `npm run check-rules`). Any new or modified rule intentionally set to
  `'off'` must carry a rationale comment — flag unexplained `'off'`
  entries in changed code.

## General

- TypeScript: use type aliases, never `interface` — except in vendored
  code under `src/react-native-plugin/`, which is upstream-owned.
- `package-lock.json` is never hand-edited; it is regenerated with the
  pinned npm (`npm@10.9.4`, the `packageManager` field in
  `package.json`). Flag lockfile diffs that look hand-edited or are
  inconsistent with the `package.json` changes in the same PR.
