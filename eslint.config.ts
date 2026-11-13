import {
  base,
  typescriptPendingIgnores,
} from './packages/eslint-config/src/index.ts';

// Dogfood: this repo lints its own JavaScript with the shared `base`
// — which already contains import-x, unicorn, the CommonJS overrides,
// and the coverage-ignore discipline — and holds its own comments to
// that discipline. The test suite is TypeScript and typechecked (via the
// package's tsconfig.test.json, run as part of `npm run typecheck`); TypeScript
// sources — like every consumer right now — are not linted until
// typescript-eslint supports TypeScript 7 (hence
// typescriptPendingIgnores).
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
];
