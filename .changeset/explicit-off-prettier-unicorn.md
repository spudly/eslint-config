---
'@spudly/eslint-config': patch
---

Source-only cleanup with no behavior change: four unicorn rules are now
explicitly `'off'` in the unicorn block instead of `'error'`.

`unicorn/empty-brace-spaces`, `unicorn/no-nested-ternary`,
`unicorn/number-literal-case`, and `unicorn/template-indent` were set to
`'error'` at the source, but the eslint-config-prettier block composed
last in `base` already turned every one of them off — so the effective
config consumers receive has always had them off, while the source
read as if they were on. Each entry is now `'off'` with a rationale
comment, so the source matches the effective config.

The effective config is unchanged, verified by composing every export
(`base`, `jest`, `node`, `react`, `reactNative`, `tailwind`,
`typescriptPendingIgnores`, `reactPending`) through ESLint's
`calculateConfigForFile` over probe filenames before and after the
change: the full rule sets are identical for every export.
