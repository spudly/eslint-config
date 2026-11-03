---
'@spudly/eslint-config': patch
---

Test files are now exempt from the line-count rules in the `base` config (issue #29). Files matching the test patterns the config already uses — `*.test.*`, `*.spec.*`, the jest setup/env filenames, and anything under `__tests__/` — no longer report `max-lines` or `max-lines-per-function`, whatever test framework a consumer runs (previously the exemption only arrived via the `jest` export). Non-test files keep the current limits unchanged.
