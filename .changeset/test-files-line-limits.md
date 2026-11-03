---
'@spudly/eslint-config': patch
---

Test files are now exempt from the line-count rules in the `base` config (issue #29). Files matching the test patterns the config already uses — `*.test.{ts,js,tsx,jsx,cjs}`, `*.spec.{ts,js}`, the jest setup/env filenames (`jest.setup.{ts,js,cjs}`, `jest.env.{ts,js}`, `jest.setupEnv.{ts,js}`), and `__tests__/**/*.{ts,tsx,js,jsx}` — no longer report `max-lines` or `max-lines-per-function`, whatever test framework a consumer runs (previously the exemption only arrived via the `jest` export). Extensions outside those patterns (for example `.test.mjs` or `.spec.tsx`) are not covered, matching the existing patterns. Non-test files keep the current limits unchanged.
