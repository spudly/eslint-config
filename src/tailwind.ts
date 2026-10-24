import betterTailwindPlugin from 'eslint-plugin-better-tailwindcss';
import type {Linter} from 'eslint';

/**
 * Tailwind v4 rules (eslint-plugin-better-tailwindcss, pinned to 4.5.0 —
 * the version Eciperay's config was tuned against).
 *
 * Ported from sections 8 and 8a of Eciperay's eslint.config.ts, which
 * applied the identical rule set to the app and web packages; the shared
 * version applies it to all component files. Consumers whose Tailwind
 * usage is limited to part of the tree can remap `files` on the block.
 */
export const tailwind: Linter.Config[] = [
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {'better-tailwindcss': betterTailwindPlugin},
    settings: {'better-tailwindcss': {}},
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/enforce-consistent-important-position': 'error',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'error',
      'better-tailwindcss/enforce-consistent-variant-order': 'error',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
      'better-tailwindcss/enforce-logical-properties': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-restricted-classes': 'error',
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
    },
  },
];

export default tailwind;
