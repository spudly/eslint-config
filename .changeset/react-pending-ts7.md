---
'@spudly/eslint-config': minor
---

The @eslint-react rules are temporarily disabled pending TypeScript 7
compatibility, mirroring the typescript-eslint treatment. In 0.1.0 the
`react` export crashed on load for every TypeScript 7 consumer:
@eslint-react's plugin chain (eslint-plugin-react-x -> ts-api-utils)
reads `ts.TypeFlags` at module init, which TypeScript 7 does not
expose (issue #8). The full @eslint-react configuration — every rule,
severity, and rationale comment, preserved verbatim — moves out of
`react` into a new subpath-only export, `reactPending`
(`@spudly/eslint-config/react-pending`), which no consumer composes
yet; it is deliberately not re-exported from the package root, so
root imports stay loadable under TypeScript 7. The `react` export
still ships the eslint-plugin-react-hooks rules. When an upstream
@eslint-react release adds TypeScript 7 compatibility, the pending
block folds back into `react` and the rules return with a normal
release — guarded by a new TypeScript 7 consumer-fixture test that
installs the packed package next to typescript@^7 and asserts the
composed exports load and lint there.
