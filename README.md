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
  commonjsOverrides,
  coverageIgnore,
  importX,
  jest,
  noClassNameOutsideComponents,
  node,
  react,
  reactNative,
  tailwind,
  typescriptPendingIgnores,
  unicorn,
} from '@spudly/eslint-config';

export default [
  // Repo-local ignores (dist, node_modules, generated code) go here.
  ...typescriptPendingIgnores, // until typescript-eslint supports TS7
  ...base,
  ...importX,
  ...unicorn,
  ...commonjsOverrides, // must come after importX + unicorn
  ...react,
  ...reactNative,
  ...node,
  ...jest,
  ...tailwind,
  ...coverageIgnore,
  ...noClassNameOutsideComponents,
];
```

Each export is an array of flat-config objects. Default `files` globs
are generic (any-depth directory patterns, e.g. the `node` export
matches `server/` and `mcp-server/` directories anywhere in the tree).
If a repo's layout differs, remap `files` on the returned blocks:

```ts
const nodeForApi = node.map(block => ({...block, files: ['api/**/*.ts']}));
```

Every export is also available as a subpath import with a default
export, e.g. `import base from '@spudly/eslint-config/base'`.

## Exports

| Export                         | Subpath                                                 | Contents                                                                                                                                                                                                               | Source in Eciperay's config                        |
| ------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `base`                         | `@spudly/eslint-config/base`                            | All 292 core ESLint rules explicitly configured; JS-file re-enables for rules superseded by @typescript-eslint; eslint-comments discipline (a reason is required on every inline disable); eslint-config-prettier last | Sections 1, 1b, 11, 13                             |
| `commonjsOverrides`            | (root only)                                             | Node globals + `import-x/no-commonjs` / `unicorn/prefer-module` off for `.cjs` config files. Must be composed **after** `importX` and `unicorn`                                                                        | Section 4a                                         |
| `importX`                      | `@spudly/eslint-config/import-x`                        | eslint-plugin-import-x, every rule explicit; plus the web/client `no-cycle` relaxation generalized to `web/`/`client/` directories                                                                                     | Sections 3, 8b                                     |
| `unicorn`                      | `@spudly/eslint-config/unicorn`                         | eslint-plugin-unicorn, every rule explicit, plus the Oct 2026 additions held `off` pending evaluation                                                                                                                  | Sections 4, 12 (unicorn part)                      |
| `react`                        | `@spudly/eslint-config/react`                           | React rules on `@eslint-react/eslint-plugin` (see migration notes below) + eslint-plugin-react-hooks, every rule explicit                                                                                              | Sections 5 (react part), 8c, 12 (react-hooks part) |
| `reactNative`                  | `@spudly/eslint-config/react-native`                    | The 7 react-native rules, **vendored** (see below): 5 on, 2 off, matching Eciperay severities                                                                                                                          | Section 5 (react-native part)                      |
| `node`                         | `@spudly/eslint-config/node`                            | eslint-plugin-n for server code, every rule explicit, plus the Oct 2026 additions held `off`                                                                                                                           | Sections 6, 12 (n part)                            |
| `jest`                         | `@spudly/eslint-config/jest`                            | eslint-plugin-jest for test/setup files (with the core/unicorn relaxations Eciperay applies in test scope), every rule explicit, plus the Oct 2026 additions held `off`                                                | Sections 7, 12 (jest part)                         |
| `tailwind`                     | `@spudly/eslint-config/tailwind`                        | eslint-plugin-better-tailwindcss (pinned 4.5.0, the version the source config was tuned against)                                                                                                                       | Sections 8, 8a                                     |
| `coverageIgnore`               | `@spudly/eslint-config/coverage-ignore`                 | Eciperay's custom `coverage-ignore/require-description` rule: every istanbul/c8 ignore comment must carry a `-- reason`. Applies globally, no `files` glob                                                             | Section 10                                         |
| `noClassNameOutsideComponents` | `@spudly/eslint-config/no-classname-outside-components` | Eciperay's custom className rule (namespace `spudly-ui`): `className` only inside the components directory; see the custom-rules section for the `allowedSegment` option                                               | Section 10a                                        |
| `typescriptPendingIgnores`     | `@spudly/eslint-config/typescript`                      | Global ignores for `*.ts`/`*.tsx`/`*.mts`/`*.cts` — the interim state while typescript-eslint lacks TS7 support (see below)                                                                                            | Top-of-file ignores block                          |

### Which repos use which subsets (planned adoption)

- **Eciperay**: everything — it is the source of the rule sets.
- **Memorize**: `typescriptPendingIgnores`, `base`, `importX`,
  `unicorn`, `commonjsOverrides`, `react`, `reactNative`, `jest`,
  `coverageIgnore`. No server (no `node`), no Tailwind.
- **Design system**: `typescriptPendingIgnores`, `base`, `importX`,
  `unicorn`, `commonjsOverrides`, `react`, `coverageIgnore`. A library,
  not an app: no `node`, no `jest` (tests run on `node --test`), no
  Tailwind, and the react-native app-screen rules don't fit library
  primitives.

The `noClassNameOutsideComponents` export is currently planned for
Eciperay only — it is the app/web className policy; the design system
is the components library itself, and Memorize styles through
Tamagui rather than `className`.

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

## Custom rules (ported from Eciperay)

Eciperay's two hand-written rules live in this package (moved here at
Stephen's direction, 2026-10-24, rather than staying Eciperay-local):

- **`coverage-ignore/require-description`** (export `coverageIgnore`,
  source `src/coverage-ignore-plugin.ts`) — ported faithfully from
  Eciperay's `eslint-rules/coverage-ignore-require-description.ts`:
  any `istanbul ignore` / `c8 ignore` comment without a `-- reason`
  is an error. It was already fully generic, so the shared export
  applies it globally with no `files` glob, exactly as Eciperay's
  section 10 did.
- **`spudly-ui/no-classname-outside-components`** (export
  `noClassNameOutsideComponents`, source
  `src/no-classname-outside-components-plugin.ts`) — ported from
  Eciperay's `eslint-rules/no-classname-outside-components.ts`, where
  the plugin namespace was the Eciperay-specific `eciperay-ui`; the
  shared package registers it under the generic **`spudly-ui`**
  namespace (Eciperay's adoption PR renames its side). It reports
  `className` JSX attributes outside the components directory, so
  styling stays inside reusable components. Generalizations from the
  original:
  - The rule no longer gates itself to Eciperay's
    `packages/app` / `packages/web` layout — applicability is the
    export's `files` glob (any-depth `src` TSX), as with every other
    piece of this package.
  - "Allowed" means the file path contains a `src/components/`
    segment (any package layout; the original hard-coded
    `/packages/(app|web)/src/components/`), or the segment given by
    the rule's `allowedSegment` option:
    `'spudly-ui/no-classname-outside-components': ['error', {allowedSegment: 'src/ui'}]`.
    The default is `src/components`.
  - Test files (`*.test.tsx`) stay exempt, and the export keeps
    Eciperay's config-level ignores for the components tree and test
    files as well (the original's belt-and-braces setup).

Both rules carry their original Eciperay unit tests, ported to this
package's harness, plus Linter-API tests through the config exports
(components file passes, test file passes, page/screen file fails,
custom `allowedSegment` works).

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
- Nonstandard Jest setup filenames in section 7's explicit file list
  (e.g. `test/failOnConsoleError.cjs`); the shared `jest` export covers
  the conventional patterns (`*.test.*`, `*.spec.*`, `jest.setup.*`,
  `jest.env.*`, `__tests__/`, `src/test/`). Repos with extra setup
  files should remap `files` as shown above.

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
npm run lint          # dogfood: base + importX + unicorn + coverageIgnore over this repo's JS
npm run prettier:check
```

Releases use Changesets, like `@spudly/ui`: add a changeset with your
PR (`npm run changeset`), and on merge to `main` the release workflow
opens a Version Packages PR and publishes to GitHub Packages. The
release workflow needs the repository setting **"Allow GitHub Actions
to create and approve pull requests"** enabled (Settings -> Actions ->
General), the same toggle the design-system repo uses.
