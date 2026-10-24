import type {Linter} from 'eslint';

import coverageIgnorePlugin from './coverage-ignore-plugin.js';

/**
 * Coverage-ignore discipline — section 10 of Eciperay's
 * eslint.config.ts: every `istanbul ignore` / `c8 ignore` comment must
 * include a `-- reason`, so a coverage suppression is always
 * self-documenting (same spirit as the eslint-comments discipline in
 * `base`).
 *
 * Ported from Eciperay's local custom rule at Stephen's direction
 * (2026-10-24). Applies globally with no `files` glob, exactly as in
 * Eciperay. Folded into the `base` export (Stephen, 2026-10-24) — not
 * a standalone export.
 */
export const coverageIgnore: Linter.Config[] = [
  {
    plugins: {'coverage-ignore': coverageIgnorePlugin},
    rules: {'coverage-ignore/require-description': 'error'},
  },
];

export default coverageIgnore;
