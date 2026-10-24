import type {Linter} from 'eslint';

/**
 * Global ignores for TypeScript files — the interim state while
 * typescript-eslint does not support TypeScript 7.
 *
 * typescript-eslint was the only TypeScript parser in these repos and is
 * uninstalled pending its TypeScript 7 support, so ESLint cannot parse
 * TypeScript at all. Until it returns, .ts/.tsx files are NOT linted —
 * `npm run typecheck` (TS7) is the correctness gate for TS. Plain
 * JS/CJS/MJS files are still linted by the other exports.
 *
 * This is a separate, explicitly-named export (not baked into `base`) so
 * every consumer opts into the interim behavior visibly, per repo.
 *
 * RESTORE PATH: when typescript-eslint ships TS7 support, this package
 * gains a real `typescript` config section (parser + @typescript-eslint/*
 * rules, ported from the removed section 2 of Eciperay's config);
 * consumers then delete this export from their config array, re-enable
 * the core rules in `base` section 1 that are currently noted as
 * "superseded by @typescript-eslint", and TS linting returns everywhere
 * at once.
 */
export const typescriptPendingIgnores: Linter.Config[] = [
  {
    ignores: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  },
];

export default typescriptPendingIgnores;
