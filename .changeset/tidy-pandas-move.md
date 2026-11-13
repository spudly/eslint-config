---
'@spudly/eslint-config': patch
---

Move `@spudly/eslint-config` into `packages/eslint-config/` as this
repository becomes the shared tooling monorepo. No consumer-visible
change: the package name, version line, exports, and install contract
are unchanged, and consumers upgrade with no import changes.
