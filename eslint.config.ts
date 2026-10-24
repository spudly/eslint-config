import {
  base,
  commonjsOverrides,
  importX,
  typescriptPendingIgnores,
  unicorn,
} from './src/index.ts';

// Dogfood: this repo lints its own JavaScript (the test suite) with the
// shared base + importX + unicorn pieces. TypeScript sources are covered
// by `npm run typecheck` and — like every consumer right now — are not
// linted until typescript-eslint supports TypeScript 7 (hence
// typescriptPendingIgnores).
export default [
  {ignores: ['dist/**', 'node_modules/**']},
  ...typescriptPendingIgnores,
  ...base,
  ...importX,
  ...unicorn,
  ...commonjsOverrides,
];
