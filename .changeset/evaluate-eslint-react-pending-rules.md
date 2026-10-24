---
'@spudly/eslint-config': minor
---

The issue #4 evaluation of the @eslint-react rules is complete: all 42
rules that were held `'off'` as undecided in the `reactPending` export
are now decided. Each was trialled as `'error'` against the design
system's `src/` tree (41 reported zero findings; `immutability`'s four
findings are a single design-system site, filed as
spudly/design-system#135 to refactor before restoration). 39 are now
`'error'` in `reactPending`, with the trial result recorded on each
entry. The three type-requiring rules (`no-implicit-children`,
`no-implicit-key`, `no-implicit-ref`) stay `'off'` with a recorded
rationale: enabling them crashes lint runs that have no typed parser
setup, and no consumer runs typed linting today — they are flagged
for re-evaluation at restoration (issue #8), when typed linting
exists.

Hooks-source decision, also recorded in the source: the classic hooks
rules stay with eslint-plugin-react-hooks (`@eslint-react`'s
`rules-of-hooks`/`exhaustive-deps` stay `'off'`), and for the React
Compiler diagnostics that exist under both namespaces, the
@eslint-react versions are the single source — the react-hooks
duplicates in the `react` export stay `'off'` by decision so nothing
double-reports when `reactPending` is restored.

No consumer's effective config changes today: `reactPending` is still
composed nowhere (restoration remains tracked by issue #8), and the
composed exports are untouched.
