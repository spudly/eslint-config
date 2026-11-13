/**
 * Vendored eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * Upstream 5.0.0 is the latest release and caps its peer range at
 * eslint ^9, so it cannot be installed alongside ESLint 10. The seven
 * rules are vendored here with the removed ESLint 10 rule-context APIs
 * adapted (`context.getSourceCode()` -> `context.sourceCode`,
 * `context.getFilename()` -> `context.filename`, `context.getScope()`
 * fallbacks dropped).
 *
 * Not ported: upstream's legacy `environments.react-native` globals
 * (from eslint-plugin-react-native-globals) — Eciperay never used the
 * environment, only the rules.
 */
import type {ESLint} from 'eslint';

import noColorLiterals from './rules/no-color-literals.js';
import noInlineStyles from './rules/no-inline-styles.js';
import noRawText from './rules/no-raw-text.js';
import noSingleElementStyleArrays from './rules/no-single-element-style-arrays.js';
import noUnusedStyles from './rules/no-unused-styles.js';
import sortStyles from './rules/sort-styles.js';
import splitPlatformComponents from './rules/split-platform-components.js';

const reactNativePlugin: ESLint.Plugin = {
  meta: {
    name: '@spudly/eslint-config (vendored eslint-plugin-react-native)',
    version: '5.0.0',
  },
  rules: {
    'no-color-literals': noColorLiterals,
    'no-inline-styles': noInlineStyles,
    'no-raw-text': noRawText,
    'no-single-element-style-arrays': noSingleElementStyleArrays,
    'no-unused-styles': noUnusedStyles,
    'sort-styles': sortStyles,
    'split-platform-components': splitPlatformComponents,
  },
};

export default reactNativePlugin;
