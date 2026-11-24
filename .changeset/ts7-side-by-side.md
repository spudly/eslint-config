---
'@spudly/eslint-config': patch
---

Document and fixture-prove the TypeScript 7 side-by-side consumer setup (issue #8): alias the resolvable `typescript` to `@typescript/typescript6` for the lint runtime so the `react-pending` export loads, and keep TypeScript 7 installed under a `typescript7` alias for compilation.
