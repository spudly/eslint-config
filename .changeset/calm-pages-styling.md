---
'@spudly/eslint-config': minor
---

Add the `noPageStyling` export (`@spudly/eslint-config/no-page-styling`),
carrying the new `no-page-styling/no-page-styling` rule promoted from
the design system's local copy: files a consumer scopes it to must not
apply styling directly — no imports from `tamagui` or any `@tamagui/*`
package, no `className`, and no inline `style` prop — so styling stays
inside reusable components behind semantic props. The export is
rules-only with no baked-in file globs; each repo attaches its own
paths (the design system: `src/pages/**/*.tsx` + `src/views/**/*.tsx`; the apps:
app source, with provider/theme-bootstrap carve-outs in their adoption
plans). The rule starts at `warn` under the severity policy and
promotes to `error` after one month.
