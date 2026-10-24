import type {Linter} from 'eslint';

import reactNativePlugin from './react-native-plugin/index.js';

/**
 * React Native rules — the react-native part of section 5 of Eciperay's
 * eslint.config.ts.
 *
 * The rules are VENDORED from eslint-plugin-react-native 5.0.0 (MIT —
 * see NOTICE in this package) because upstream has no ESLint 10
 * release: 5.0.0 caps its peer range at eslint ^9. The vendored copies
 * are adapted to the ESLint 10 rule-context APIs and live in
 * src/react-native-plugin/. Severities match Eciperay exactly: five
 * rules on, two off with their rationales.
 */
export const reactNative: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {'react-native': reactNativePlugin},
    rules: {
      // react-native — all 7 rules
      'react-native/no-color-literals': 'error',
      'react-native/no-inline-styles': 'error',
      'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/no-unused-styles': 'error',
      'react-native/sort-styles': 'off', // stylistic preference; logical grouping is preferable
      'react-native/split-platform-components': 'off', // we handle platform differences programmatically with Platform.select
    },
  },
];

export default reactNative;
