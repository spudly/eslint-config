import type {Linter} from 'eslint';

import jsxNoLiteralsPlugin from './jsx-no-literals-plugin.js';

/**
 * No hard-coded user-facing strings (issue #42; design-system #539):
 * the ported `jsx-no-literals/no-literals` rule bans string literals
 * as JSX children and in the user-facing string props below, so copy
 * flows through each app's i18n voice/catalog machinery instead of
 * being hard-coded in components. See `jsx-no-literals-plugin.ts`
 * for the port and its two adaptations (restricted attributes;
 * punctuation/symbol-only literals allowed).
 *
 * Folded into the `react` export (following the coverage-ignore and
 * test-colocation precedents) — not a standalone export, per the
 * small export surface Stephen directed on 2026-10-24.
 *
 * A blanket `noAttributeStrings` is deliberately NOT used: it would
 * ban non-copy attribute strings (`type="button"`, `href`, ids) that
 * are not user-facing text. `restrictedAttributes` names exactly the
 * user-facing string props from issue #42; more can be added later
 * without a breaking change.
 *
 * Consumption (the two forms in issue #42 differ by consumer-side
 * scoping, which this package does not bake in — no repo-layout
 * globs): the design system attaches the `react` export across `src/`
 * and exempts Storybook fixtures through its own `ignores`; the apps
 * attach it to UI code. The README documents both patterns.
 *
 * Severity: 'warn' since 2026-11-07 (issue #27 severity policy: a
 * newly enabled rule starts at 'warn' and promotes to 'error' after
 * one month — promote on/after 2026-12-07 by the monthly promotion
 * task).
 */
export const jsxNoLiterals: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {'jsx-no-literals': jsxNoLiteralsPlugin},
    rules: {
      'jsx-no-literals/no-literals': [
        'warn',
        {
          noStrings: true,
          restrictedAttributes: ['aria-label', 'alt', 'placeholder', 'title'],
        },
      ],
    },
  },
];

export default jsxNoLiterals;
