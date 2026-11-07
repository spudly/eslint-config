---
'@spudly/eslint-config': minor
---

Enforce test-file colocation and naming: the new `test-colocation/exact-base-name` rule (in `base`, at `warn` per the severity policy) flags test files whose base name does not exactly match a colocated sibling source file — covering `.test.<ext>` and `.test.e2e.<ext>` tests, `.test.steps.md` manual steps, `.stories.<ext>` files, and `__snapshots__/` files that do not start with the tested file's base name. The jest export now also applies to `**/*.test.e2e.*` files, and `unicorn/filename-case` no longer flags the `__snapshots__` directory.
