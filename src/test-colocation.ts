import type {Linter} from 'eslint';

import testColocationPlugin from './test-colocation-plugin.js';

/**
 * Test-file colocation discipline (issue #37): test files sit next to
 * the file they test and share its exact base name — see
 * `test-colocation-plugin.ts` for the convention in full.
 *
 * Folded into the `base` export (following the coverage-ignore
 * precedent) — not a standalone export, per the small export surface
 * Stephen directed on 2026-10-24.
 *
 * Severity: 'warn' since 2026-11-07 (issue #27 severity policy: a
 * newly enabled rule starts at 'warn' and promotes to 'error' after
 * one month — promote on/after 2026-12-07 by the monthly promotion
 * task).
 */
export const testColocation: Linter.Config[] = [
  {
    plugins: {'test-colocation': testColocationPlugin},
    rules: {'test-colocation/exact-base-name': 'warn'},
  },
];

export default testColocation;
