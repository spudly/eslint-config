# @spudly/eslint-config

Shared ESLint 10 flat config for Spudly repos (Eciperay, Memorize, and
the design system). The rule sets are ported from Eciperay's
`eslint.config.ts` — where every rule from every plugin is explicitly
configured with its rationale recorded inline — and packaged as
composable pieces so each repo composes only the subsets that apply to
the code it actually has.

## Install

Consumers install ESLint and this config; every plugin is a dependency
of this package, so nothing else needs to be installed (except Jest —
see the `jest` note below).

```sh
npm install --save-dev eslint@^10 @spudly/eslint-config
```

The `@spudly` scope lives on GitHub Packages; consumers need the same
`.npmrc` the `@spudly/ui` package uses:

```
@spudly:registry=https://npm.pkg.github.com
```

with a `NODE_AUTH_TOKEN` (classic PAT with `read:packages`, or the `gh`
CLI token) available at install time — the same setup as `@spudly/ui`.

Peer requirements: `eslint` `^10.0.0`, Node `>=20.19.0` (the floor set
by `@eslint-react/eslint-plugin` v5).

## Usage

```ts
import {
  base,
  jest,
  node,
  react,
  reactNative,
  tailwind,
  typescriptPendingIgnores,
} from '@spudly/eslint-config';

export default [
  // Repo-local ignores (dist, node_modules, generated code) go here.
  ...typescriptPendingIgnores, // until typescript-eslint supports TS7
  ...base, // core + import-x + unicorn + CJS overrides + coverage-ignore
  ...react,
  ...reactNative,
  // `node` is rules-only: attach your own server directories.
  ...node.map(block => ({
    ...block,
    files: ['packages/server/**', 'packages/mcp-server/**'],
  })),
  ...jest,
  ...tailwind,
];
```

Each export is an array of flat-config objects. **This package
carries no repo-layout path overrides** (Stephen, 2026-10-24): the
only `files:`/`ignores:` globs inside the package are
extension/language patterns (plus Jest's own naming conventions in
the `jest` export). Rule groups that need directory scoping — the
`node` server rules — ship as rules-only exports, and each consuming
repo attaches its own paths by mapping `files` onto the returned
blocks, as in the example above.

Every export is also available as a subpath import with a default
export, e.g. `import base from '@spudly/eslint-config/base'`.

## Exports

| Export                     | Subpath                              | Contents                                                                                                                                                                                                                                                                                                                                                                                                          | Source in Eciperay's config                             |
| -------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `base`                     | `@spudly/eslint-config/base`         | Everything every repo shares: all 292 core ESLint rules explicitly configured; JS-file re-enables for rules superseded by @typescript-eslint; eslint-plugin-import-x and eslint-plugin-unicorn, every rule explicit; the `.cjs` CommonJS overrides; eslint-comments discipline (a reason is required on every inline disable); the `coverage-ignore/require-description` custom rule; eslint-config-prettier last | Sections 1, 1b, 3, 4, 4a, 10, 11, 12 (unicorn part), 13 |
| `react`                    | `@spudly/eslint-config/react`        | React rules on `@eslint-react/eslint-plugin` (see migration notes below) + eslint-plugin-react-hooks, every rule explicit                                                                                                                                                                                                                                                                                         | Sections 5 (react part), 8c, 12 (react-hooks part)      |
| `reactNative`              | `@spudly/eslint-config/react-native` | The 7 react-native rules, **vendored** (see below): 5 on, 2 off, matching Eciperay severities                                                                                                                                                                                                                                                                                                                     | Section 5 (react-native part)                           |
| `node`                     | `@spudly/eslint-config/node`         | eslint-plugin-n for server code, every rule explicit, plus the Oct 2026 additions held `off`. **Rules only — no `files:` globs**; the consuming repo attaches its own server paths (see Usage)                                                                                                                                                                                                                    | Sections 6, 12 (n part)                                 |
| `jest`                     | `@spudly/eslint-config/jest`         | eslint-plugin-jest for test/setup files (with the core/unicorn relaxations Eciperay applies in test scope), every rule explicit, plus the Oct 2026 additions held `off`. Scoped by Jest naming conventions only (test/spec suffixes, `jest.setup*` filenames, `__tests__/`)                                                                                                                                       | Sections 7, 12 (jest part)                              |
| `tailwind`                 | `@spudly/eslint-config/tailwind`     | eslint-plugin-better-tailwindcss (pinned 4.5.0, the version the source config was tuned against)                                                                                                                                                                                                                                                                                                                  | Sections 8, 8a                                          |
| `typescriptPendingIgnores` | `@spudly/eslint-config/typescript`   | Global ignores for `*.ts`/`*.tsx`/`*.mts`/`*.cts` — the interim state while typescript-eslint lacks TS7 support (see below)                                                                                                                                                                                                                                                                                       | Top-of-file ignores block                               |

### Which repos use which subsets (planned adoption)

- **Eciperay**: everything — it is the source of the rule sets.
- **Memorize**: `typescriptPendingIgnores`, `base`, `react`,
  `reactNative`, `jest`. No server (no `node`), no Tailwind.
- **Design system**: `typescriptPendingIgnores`, `base`, `react`.
  A library, not an app: no `node`, no `jest` (tests run on
  `node --test`), no Tailwind, and the react-native app-screen rules
  don't fit library primitives.

## React: the @eslint-react migration

Eciperay's config used `eslint-plugin-react`, whose latest release
(7.37.5) caps its peer range at `eslint@^9.7` — there is no ESLint 10
release, which is what blocked Eciperay's ESLint 10 upgrade (PR #117).
The `react` export is therefore built on
[`@eslint-react/eslint-plugin`](https://eslint-react.xyz) v5 (requires
ESLint >= 10, Node >= 20.19), following ESLint React's
[official migration guide](https://eslint-react.xyz/docs/migrating-from-eslint-plugin-react).
`eslint-plugin-react-hooks` is kept as-is — it already supports
ESLint 10.

Rules that were `error` stay `error` wherever an equivalent exists,
e.g. `react/jsx-key` -> `@eslint-react/no-missing-key`,
`react/jsx-no-comment-textnodes` -> `@eslint-react/jsx-no-comment-textnodes`,
`react/no-children-prop` -> `@eslint-react/jsx-no-children-prop`,
`react/display-name` -> `@eslint-react/no-missing-component-display-name`

- `@eslint-react/no-missing-context-display-name` (the guide's split
  equivalent), and `react/no-deprecated` -> its split equivalents
  (`no-component-will-*`, `dom-no-render`, `dom-no-hydrate`, ...).

Dropped, with the reason recorded in `src/react.ts`:

- `react/jsx-no-undef`, `react/jsx-uses-vars`, `react/jsx-uses-react` —
  ESLint 10 tracks JSX references natively; the rules are unnecessary.
- `react/jsx-filename-extension`, `react/jsx-no-duplicate-props` —
  upstream offers these only as custom rules via `@eslint-react/kit`;
  no built-in equivalent.
- `react/no-unescaped-entities` — no @eslint-react equivalent. App JSX
  text is also policed by the vendored `react-native/no-raw-text`.
- `react/no-is-mounted`, `react/no-string-refs`,
  `react/require-render-return` — no equivalent; legacy
  class-component-era rules in a codebase with no class components.
- The prop-types family, the JSX formatting family (Prettier's job),
  and the remaining `off` class-component rules were not carried over;
  the @eslint-react rule set is enumerated in full instead.
  @eslint-react rules with no eslint-plugin-react counterpart are
  `off` pending individual evaluation — the same policy as section 12
  of the source config.

Also dropped: `settings: {react: {version: 'detect'}}` (@eslint-react
does not use it). One behavior note: the source's app section (5) ran
`react-hooks/exhaustive-deps` as `error` while the web section (8c)
used `warn`; the shared export follows section 5 (`error`) — web code
can override it locally, as Eciperay's adoption may.

## React Native: vendored rules

`eslint-plugin-react-native` 5.0.0 is the latest upstream release and
caps its peer range at `eslint@^9` — a second, hidden blocker for
ESLint 10 (Meta's official `@react-native/eslint-plugin` is not a
replacement; it ships only two unrelated rules). The seven rules are
therefore **vendored** in `src/react-native-plugin/`, ported from the
MIT-licensed upstream source (see `NOTICE`), with the rule-context
APIs removed in ESLint 9/10 adapted:

- `context.getSourceCode()` -> `context.sourceCode`
- `context.getFilename()` -> `context.filename`
- `context.getScope()` fallbacks -> `context.sourceCode.getScope(node)`

Upstream's legacy `environments.react-native` globals were not ported
(no consumer used them). Every vendored rule is exercised by unit
tests on ESLint 10 (bad fixture fires, good fixture passes), including
the two rules that are `off` by default (`sort-styles`,
`split-platform-components`).

## Custom rules

One of Eciperay's hand-written rules lives in this package:

- **`coverage-ignore/require-description`** (part of `base`, source
  `src/coverage-ignore-plugin.ts`) — ported faithfully from Eciperay's
  `eslint-rules/coverage-ignore-require-description.ts`: any
  `istanbul ignore` / `c8 ignore` comment without a `-- reason` is an
  error. It is fully generic, so it applies globally with no `files`
  glob, exactly as Eciperay's section 10 did. It carries its original
  Eciperay unit tests, ported to this package's harness, plus
  Linter-API tests through `base`.

The other rule — Eciperay's section 10a
`no-classname-outside-components` — was ported here briefly and then
**removed at Stephen's direction (2026-10-24)**. Its intent is that
page components must not apply styling directly (they should be
composed of subcomponents that own the styling), and since all page
components now live in `@spudly/ui`, the rule belongs in the design
system, re-implemented there against `className`, the `style` prop,
and Tamagui styling props. Tracked in
[spudly/design-system#119](https://github.com/spudly/design-system/issues/119).
Eciperay keeps its local section 10a copy until that rule exists.

## TypeScript: the interim state and the restore path

typescript-eslint was the only TS parser in these repos and is
uninstalled everywhere pending its TypeScript 7 support, so TS files
are currently **not linted at all** — `typecheck` (TS7) is the
correctness gate. That behavior is the explicit, opt-in
`typescriptPendingIgnores` export rather than something baked silently
into `base`.

Restore path, when typescript-eslint ships TS7 support: this package
gains a real `typescript` section (parser + `@typescript-eslint/*`
rules, ported from the removed section 2 of Eciperay's config);
consumers delete `typescriptPendingIgnores` from their arrays, and TS
linting returns in all three repos with one package release. The core
rules in `base` section 1 that are noted as "superseded by
@typescript-eslint" stay as they are — they were configured for that
return.

## Known local-only pieces (not in this package)

These stay in Eciperay when it adopts the shared config:

- Section 1a: `no-console` allowances for named script/server-bootstrap
  files.
- Sections 9/9a: line-limit relaxations for TSX components and the
  `no-raw-text` allowance inside Eciperay's custom Text wrapper
  components.
- Section 8b: the `import-x/no-cycle` relaxation for the web/client
  packages (Vite workspace resolution) — directory-scoped, so it was
  never portable; it stays in Eciperay's config with its paths.
- The `node` export's paths: Eciperay attaches
  `packages/server/**` and `packages/mcp-server/**` itself (see
  Usage); the package ships the rules only.
- Nonstandard Jest setup filenames in section 7's explicit file list
  (e.g. `test/failOnConsoleError.cjs`), and the `src/test/` helper
  directory; the shared `jest` export covers the conventional
  patterns (`*.test.*`, `*.spec.*`, `jest.setup.*`, `jest.env.*`,
  `__tests__/`). Repos with extra setup files or helper directories
  add their own block reusing the `jest` rules under their paths.

One more consumer note for the `jest` export: eslint-plugin-jest
auto-detects the Jest version from the consuming repo's installed
`jest` package (as in Eciperay). A consumer without `jest` installed
must set `settings: {jest: {version: <major>}}` in a local block.

## Development

```sh
npm install
npm run build       # tsc -> dist/
npm test            # build + node --test (Linter-API tests for every export)
npm run typecheck
npm run lint          # dogfood: base over this repo's JS
npm run prettier:check
npm run check-rules   # config-currency audit (see below)
```

## Config currency: `check-rules`

The config's value depends on staying complete and current as ESLint
and its plugins evolve. `npm run check-rules` audits the built composed
config and exits non-zero when it finds drift, in three categories:

- **Deprecated** rules still configured — policy: they are _removed_
  from the config; no dead entries are kept.
- **Removed / unknown** rules still configured (the id no longer
  exists in the installed ESLint core or plugin) — policy: removed.
- **Missing** rules — available in the installed core or in a plugin
  this package composes, but with no explicit entry anywhere in the
  package — policy: every available rule gets an explicit entry, and
  anything set to `'off'` carries a comment explaining why.

The audit is implemented in `scripts/checkRules.mjs` on ESLint 10's
own metadata (the composed config's registered plugins +
`builtinRules`). eslint-find-rules was the original candidate, but its
latest release (5.0.0) caps its peer range at ESLint ^9 and cannot run
under ESLint 10; the script's header documents the scope decisions
(the upstream-owned eslint-config-prettier block, @eslint-react's
`x-` alias names, and plugin rules whose plugin is not installed).

**Weekly process:** Igor runs `check-rules` once a week and raises a
normal PR for any findings — removals for deprecated/removed rules,
explicit entries (severity + reasoning stated per rule) for new rules.
A clean week produces no PR and no noise. The changes always land as
reviewed PRs, never as silent auto-edits.

Releases use Changesets, like `@spudly/ui`: add a changeset with your
PR (`npm run changeset`), and on merge to `main` the release workflow
opens a Version Packages PR and publishes to GitHub Packages. The
release workflow needs the repository setting **"Allow GitHub Actions
to create and approve pull requests"** enabled (Settings -> Actions ->
General), the same toggle the design-system repo uses.
