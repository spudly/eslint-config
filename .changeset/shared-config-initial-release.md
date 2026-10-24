---
'@spudly/eslint-config': minor
---

Initial release (0.1.0): a shared ESLint 10 flat config for Eciperay,
Memorize, and the design system, ported from Eciperay's
eslint.config.ts with a deliberately small export surface — `base`
(core rules + import-x + unicorn + CommonJS overrides +
eslint-comments + the coverage-ignore custom rule + Prettier),
`react` (rebuilt on @eslint-react/eslint-plugin, the ESLint
10-compatible successor path for eslint-plugin-react, which has no
ESLint 10 release), `reactNative` (rules vendored from
eslint-plugin-react-native 5.0.0, MIT, and adapted to ESLint 10 APIs),
`node` (eslint-plugin-n, rules only — consumers attach their own
server paths), `jest`, `tailwind`, and `typescriptPendingIgnores` for
the interim period until typescript-eslint supports TypeScript 7.
The package bakes in no repo directory layout: scoped rule groups
carry rules only, and each consuming repo attaches its own `files:`
globs.
