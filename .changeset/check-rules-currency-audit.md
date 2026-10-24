---
'@spudly/eslint-config': patch
---

Add the `check-rules` config-currency audit (issue #2): a script that
reports deprecated, removed/unknown, and missing rules across the
composed config and exits non-zero on any finding, plus the first
audit's resolutions — 118 deprecated/removed entries deleted (all
'off', so no behavior change) and three deprecated unicorn rules
migrated to their successors at 'error' (no-array-push-push →
prefer-single-call, no-instanceof-array → no-instanceof-builtins,
no-length-as-slice-end → no-unnecessary-slice-end; successors cover
more cases). The audit runs clean after this change.
