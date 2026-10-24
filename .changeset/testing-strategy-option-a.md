---
'@spudly/eslint-config': patch
---

Test-only change (no published files change — the tarball ships only
`dist`): implement the Option A testing strategy from issue #3. The
suite gains XO-style behavior fixtures for the high-value rule groups
(one per export), targeted composition assertions (plugin
registrations, the groups folded into `base`, fold ordering, the
Prettier block last — no full snapshots), and an airbnb-style consumer
smoke covering every export in `package.json`. Completeness auditing
stays with `check-rules`; no rule or export behavior changes.
