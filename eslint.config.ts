import {base, typescriptPendingIgnores} from './src/index.ts';

// Dogfood: this repo lints its own JavaScript with the shared `base`
// — which already contains import-x, unicorn, the CommonJS overrides,
// and the coverage-ignore discipline — and holds its own comments to
// that discipline. The test suite is TypeScript and typechecked (via
// tsconfig.test.json, run as part of `npm run typecheck`); TypeScript
// sources — like every consumer right now — are not linted until
// typescript-eslint supports TypeScript 7 (hence
// typescriptPendingIgnores).
export default [
  {ignores: ['dist/**', 'node_modules/**']},
  ...typescriptPendingIgnores,
  ...base,
];
