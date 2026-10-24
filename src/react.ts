import reactHooksPlugin from 'eslint-plugin-react-hooks';
import type {ESLint, Linter} from 'eslint';

// eslint-plugin-react-hooks' own plugin type conflicts with ESLint's
// Plugin type on its legacy `configs.flat` shape; the runtime object is
// a valid flat-config plugin, so it is cast here.
const reactHooks = reactHooksPlugin as unknown as ESLint.Plugin;

/**
 * React rules that load TODAY under TypeScript 7: eslint-plugin-react-hooks
 * only.
 *
 * The @eslint-react rule set that used to sit alongside the hooks
 * rules here is held in the pending export (src/react-pending.ts,
 * `@spudly/eslint-config/react-pending`) because @eslint-react's
 * plugin chain — eslint-plugin-react-x importing ts-api-utils, which
 * reads `ts.TypeFlags` at module init — crashes on load for any
 * consumer whose resolvable TypeScript is 7.x (issue #8). Stephen's
 * decision (2026-10-24) gives it the typescript-eslint treatment:
 * disabled until an upstream release adds TypeScript 7 compatibility,
 * then restored by composition — the pending block folds back into
 * this file and the full React rule set returns. The pending file
 * carries the full @eslint-react configuration and its migration
 * documentation, preserved verbatim.
 *
 * What remains here is ported from sections 5 and 12 of Eciperay's
 * eslint.config.ts: the two classic hooks rules as 'error' (the app
 * section's severity; the web section 8c used 'warn' for
 * exhaustive-deps — consumers can override per file set, as before),
 * plus the react-hooks 7 (React Compiler) rule set held 'off',
 * which preserves prior lint behavior exactly. The Compiler
 * diagnostics that also exist in @eslint-react were evaluated in
 * issue #4 (2026-10-24): the @eslint-react versions in
 * src/react-pending.ts are the chosen single source for them, so
 * their react-hooks duplicates below (static-components, use-memo,
 * immutability, globals, refs, set-state-in-effect, error-boundaries,
 * purity, set-state-in-render, unsupported-syntax) stay 'off' by
 * decision, not undecided — enabling both namespaces would
 * double-report the same patterns. The remaining react-hooks 7
 * additions are still 'off', awaiting individual evaluation.
 */
export const react: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {'react-hooks': reactHooks},
    rules: {
      // ── react-hooks — all 2 classic rules (from section 5) ────────────────
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  // ─── 12 (react-hooks subset). Rules added by the Oct 2026 dependency updates ──
  // Disabled pending individual evaluation, which preserves prior lint
  // behavior exactly (none of them were applied before).
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {'react-hooks': reactHooks},
    rules: {
      // react-hooks 7 (React Compiler rule set) additions
      'react-hooks/hooks': 'off',
      'react-hooks/capitalized-calls': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/void-use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/memo-dependencies': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/memoized-effect-dependencies': 'off',
      'react-hooks/exhaustive-effect-dependencies': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/no-deriving-state-in-effects': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/invariant': 'off',
      'react-hooks/todo': 'off',
      'react-hooks/syntax': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/rule-suppression': 'off',
      'react-hooks/fbt': 'off',
    },
  },
];

export default react;
