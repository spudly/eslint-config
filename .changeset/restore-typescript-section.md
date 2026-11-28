---
'@spudly/eslint-config': minor
---

Restore the real `typescript` section under the side-by-side TypeScript 6 / TypeScript 7 shape (issue #67). The `./typescript` subpath (and the package root) now exports `typescript`: the typescript-eslint parser with `projectService` plus the full `@typescript-eslint/*` rule set ported from section 2 of Eciperay's pre-extraction config, instead of only the interim global ignores.

**Adoption step for `./typescript` consumers:** the restore is not gated on typescript-eslint shipping TypeScript 7 support, but it does require the side-by-side shape — alias `typescript` to `npm:@typescript/typescript6@^6.0.2` (the lint runtime; it satisfies typescript-eslint's `typescript <6.1.0` peer cap) and install TypeScript 7 as `typescript7` (`npm:typescript@^7.0.2`), running compilation/typecheck via `node ./node_modules/typescript7/bin/tsc`. A plain `typescript@^7` dependency can no longer install this package (peer conflict). Then compose `...typescript` in place of `...typescriptPendingIgnores`. `typescriptPendingIgnores` remains available, marked legacy/interim, for consumers not yet on the side-by-side shape.
