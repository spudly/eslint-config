import {
  base,
  commonjsOverrides,
  coverageIgnore,
  importX,
  typescriptPendingIgnores,
  unicorn,
} from './src/index.ts';

// Dogfood: this repo lints its own JavaScript (the test suite) with the
// shared base + importX + unicorn pieces, and holds its own comments to
// the coverageIgnore discipline. TypeScript sources are covered
// by `npm run typecheck` and — like every consumer right now — are not
// linted until typescript-eslint supports TypeScript 7 (hence
// typescriptPendingIgnores). The noClassNameOutsideComponents piece is
// not dogfooded: this repo has no src/ TSX tree for it to apply to.
export default [
  {ignores: ['dist/**', 'node_modules/**']},
  ...typescriptPendingIgnores,
  ...base,
  ...importX,
  ...unicorn,
  ...commonjsOverrides,
  ...coverageIgnore,
];
