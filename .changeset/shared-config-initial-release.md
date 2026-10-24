---
'@spudly/eslint-config': minor
---

Initial release (0.1.0): composable ESLint 10 flat-config pieces ported
from Eciperay's eslint.config.ts — `base`, `importX`, `unicorn`, `node`,
`jest`, `tailwind`, Eciperay's two custom rules as the `coverageIgnore`
and `noClassNameOutsideComponents` exports, plus a `react` export rebuilt on
@eslint-react/eslint-plugin (the ESLint 10-compatible successor path for
eslint-plugin-react, which has no ESLint 10 release), a `reactNative`
export whose rules are vendored from eslint-plugin-react-native 5.0.0
(MIT) and adapted to ESLint 10 APIs, `commonjsOverrides`, and
`typescriptPendingIgnores` for the interim period until
typescript-eslint supports TypeScript 7.
