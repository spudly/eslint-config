import {base, typescriptPendingIgnores} from './src/index.ts';

// Dogfood: this repo lints its own JavaScript (the test suite) with
// the shared `base` — which already contains import-x, unicorn, the
// CommonJS overrides, and the coverage-ignore discipline — and holds
// its own comments to that discipline. TypeScript sources are covered
// by `npm run typecheck` and — like every consumer right now — are not
// linted until typescript-eslint supports TypeScript 7 (hence
// typescriptPendingIgnores).
export default [
  {ignores: ['dist/**', 'node_modules/**']},
  ...typescriptPendingIgnores,
  ...base,
];
