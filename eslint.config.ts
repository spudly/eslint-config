import {
  base,
  typescriptPendingIgnores,
} from './packages/eslint-config/src/index.ts';

// Dogfood: this repo lints its own JavaScript with the shared `base`
// — which already contains import-x, unicorn, the CommonJS overrides,
// and the coverage-ignore discipline — and holds its own comments to
// that discipline. The repo consumes the side-by-side TS6/TS7 shape
// itself (issue #67): its resolvable `typescript` is TypeScript 6
// (aliased to @typescript/typescript6) for the lint runtime, and
// TypeScript 7 is installed under the `typescript7` alias (see
// packages/eslint-config/package.json; the consumer fixture in
// test/ts7Consumer.test.ts proves the TS7-by-path typecheck). This
// repo's own TS sources are not yet linted with the restored
// `typescript` section — they were written while TS linting was
// off, so composing it here is a separate burn-down; the dogfood
// lint therefore keeps `typescriptPendingIgnores` for now.
export default [
  {ignores: ['**/dist/**', '**/node_modules/**']},
  ...typescriptPendingIgnores,
  ...base,
  {
    // Workspace package directories are named for their npm packages
    // (kebab-case, e.g. packages/eslint-config), which can never
    // satisfy unicorn/filename-case's camelCase directory check.
    // The directory name is fixed by the package name, so the rule
    // is off for the packages' JavaScript scripts; their file names
    // remain checked everywhere else.
    files: ['packages/*/scripts/**/*.mjs'],
    rules: {'unicorn/filename-case': 'off'},
  },
  {
    // Same directory-name problem as above, one package over:
    // packages/tooling is JavaScript (not TypeScript, so its files
    // are linted, unlike packages/eslint-config's), and its directory
    // name is its npm package name.
    files: ['packages/tooling/**/*.{js,mjs}'],
    rules: {'unicorn/filename-case': 'off'},
  },
  {
    // The tooling package is a Node CLI: `process` and console output
    // are its interface, so the browser-oriented globals and the
    // no-console rule do not apply to its executable files.
    files: ['packages/tooling/cli.js'],
    languageOptions: {globals: {console: 'readonly', process: 'readonly'}},
    rules: {'no-console': 'off'},
  },
  {
    // Same directory-name problem as above, one package over:
    // packages/commitlint-config is JavaScript (not TypeScript, so
    // its files are linted, unlike packages/eslint-config's), and its
    // directory name is its npm package name.
    files: ['packages/commitlint-config/**/*.{js,mjs}'],
    rules: {'unicorn/filename-case': 'off'},
  },
];
