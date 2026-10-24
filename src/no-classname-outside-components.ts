import type {Linter} from 'eslint';

import noClassnameOutsideComponentsPlugin from './no-classname-outside-components-plugin.js';

/**
 * className only inside the components directory — section 10a of
 * Eciperay's eslint.config.ts: styling belongs in reusable components,
 * so `className` JSX attributes are an error everywhere else under
 * `src/`.
 *
 * Ported from Eciperay's local custom rule at Stephen's direction
 * (2026-10-24), with two generalizations (see the plugin source):
 *
 * - The plugin namespace is the generic `spudly-ui`; Eciperay
 *   registered it as `eciperay-ui`, and its adoption PR renames its
 *   side.
 * - Eciperay's package-specific file globs (the app and web packages'
 *   src trees) become the generic any-depth src glob below, and the
 *   rule's built-in app/web path gate is gone — applicability is this
 *   glob. The config-level ignores from section 10a (the components
 *   tree and test files) are kept as the belt-and-braces first line;
 *   the rule itself also exempts both.
 *
 * Consumers whose components live somewhere else can pass the rule's
 * `allowedSegment` option (default `src/components`) in their own
 * block using the plugin from
 * `@spudly/eslint-config/no-classname-outside-components` — or remap
 * `files`/`ignores` on this block.
 */
export const noClassNameOutsideComponents: Linter.Config[] = [
  {
    files: ['**/src/**/*.tsx'],
    ignores: ['**/src/components/**', '**/*.test.tsx'],
    plugins: {'spudly-ui': noClassnameOutsideComponentsPlugin},
    rules: {'spudly-ui/no-classname-outside-components': 'error'},
  },
];

export default noClassNameOutsideComponents;
