import type {Linter} from 'eslint';

import noPageStylingPlugin from './no-page-styling-plugin.js';

/**
 * No direct styling in scoped files (issue #60; design-system #119,
 * simplified shape per design-system #297): the ported
 * `no-page-styling/no-page-styling` rule bans direct `tamagui` /
 * `@tamagui/*` imports, `className`, and the inline `style` prop, so
 * styling stays inside reusable components behind semantic props.
 * See `no-page-styling-plugin.ts` for the port and its semantics.
 *
 * A standalone export (following the `node` precedent) — NOT folded
 * into `react` the way jsx-no-literals is: this rule must apply only
 * where a consumer scopes it, never across every React file.
 *
 * This export deliberately carries NO `files:` globs (Stephen,
 * 2026-10-24: the shared config must not bake in any repo's
 * directory layout). Spreading it bare would apply the rule
 * everywhere, so always attach your own paths:
 *
 * ```ts
 * ...noPageStyling.map(block => ({
 *   ...block,
 *   files: ['src/pages/**', 'src/views/**'],
 * })),
 * ```
 *
 * Consumption (the scoping lives with the consumer, settled in each
 * repo's own adoption plan): the design system scopes it to
 * its page and view TSX globs (stories exempted through its own
 * `ignores`/off block); the apps scope it to app source generally,
 * with carve-outs for Tamagui provider/theme bootstrap in app entry
 * points owned by their adoption plans. The README documents both
 * patterns.
 *
 * Severity: 'warn' (issue #27 severity policy: a newly enabled rule
 * starts at 'warn' and promotes to 'error' after one month —
 * promote on/after 2026-12-21 by the monthly promotion task).
 */
export const noPageStyling: Linter.Config[] = [
  {
    plugins: {'no-page-styling': noPageStylingPlugin},
    rules: {'no-page-styling/no-page-styling': 'warn'},
  },
];

export default noPageStyling;
