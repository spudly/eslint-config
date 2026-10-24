import unicornPlugin from 'eslint-plugin-unicorn';
import type {Linter} from 'eslint';

/**
 * unicorn rules for all packages.
 *
 * Ported from section 4 of Eciperay's eslint.config.ts, plus the
 * unicorn entries from section 12 (rules added by the Oct 2026 plugin
 * bump, disabled pending individual evaluation — that preserves prior
 * lint behavior exactly). Every rule is explicitly configured with its
 * rationale inline.
 */
export const unicorn: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    plugins: {unicorn: unicornPlugin},
    rules: {
      'unicorn/better-regex': 'off', // auto-fix can change regex semantics unexpectedly
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-destructuring': 'off', // too opinionated; mixed destructuring is often clearer
      'unicorn/consistent-empty-array-spread': 'error',
      'unicorn/consistent-existence-index-check': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/custom-error-definition': 'off', // we use plain Error objects, not custom subclasses
      'unicorn/empty-brace-spaces': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {camelCase: true, pascalCase: true},
          ignore: [
            /^react-native\.config\.(?:js|cjs)$/u,
            // Jest-mandated directory names and the mcp-server package directory
            // (unicorn >=66 also checks directory names against the cases).
            /^(?:__tests__|__mocks__|mcp-server)$/u,
          ],
        },
      ],
      'unicorn/import-index': 'off', // deprecated rule
      'unicorn/import-style': 'off', // too opinionated about named vs default vs namespace imports
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-anonymous-default-export': 'off', // React components often use anonymous arrow functions
      'unicorn/no-array-callback-reference': 'off', // too strict; point-free style is valid functional programming
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-array-instanceof': 'off', // deprecated rule; replaced by no-instanceof-array
      'unicorn/no-array-method-this-argument': 'error',
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-array-reduce': 'off', // reduce is valid functional programming; we allow it
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-await-in-promise-methods': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-document-cookie': 'off', // no browser/DOM code in this project
      'unicorn/no-empty-file': 'error',
      'unicorn/no-fn-reference-in-iterator': 'off', // deprecated rule
      'unicorn/no-for-loop': 'error',
      'unicorn/no-hex-escape': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-invalid-fetch-options': 'off', // no browser fetch API usage in this project
      'unicorn/no-invalid-remove-event-listener': 'off', // no DOM event listener code in this project
      'unicorn/no-keyword-prefix': 'off', // too opinionated; `newItem` and `classNames` are valid names
      'unicorn/no-length-as-slice-end': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-magic-array-flat-depth': 'error',
      'unicorn/no-negated-condition': 'error',
      'unicorn/no-negation-in-equality-check': 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'off', // no direct Buffer usage; n/no-deprecated-api covers Node.js Buffer misuse
      'unicorn/no-null': 'off', // null is a valid value in database records and API responses
      'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/no-process-exit': 'off', // handled by n/no-process-exit in the server section
      'unicorn/no-reduce': 'off', // deprecated rule; replaced by no-array-reduce
      'unicorn/no-single-promise-in-promise-methods': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/no-thenable': 'error',
      'unicorn/no-this-assignment': 'error',
      'unicorn/no-typeof-undefined': 'error',
      'unicorn/no-unnecessary-await': 'error',
      'unicorn/no-unnecessary-polyfills': 'off', // not using polyfills
      'unicorn/no-unreadable-array-destructuring': 'error',
      'unicorn/no-unreadable-iife': 'error',
      'unicorn/no-unsafe-regex': 'off', // too noisy; complex regexes are sometimes intentional
      'unicorn/no-unused-properties': 'off', // too noisy with TypeScript types and interface declarations
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/no-useless-promise-resolve-reject': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-switch-case': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/no-zero-fractions': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/numeric-separators-style': 'error',
      'unicorn/prefer-add-event-listener': 'off', // no DOM code in this project
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-blob-reading-methods': 'off', // no browser Blob API in this project
      'unicorn/prefer-code-point': 'error',
      'unicorn/prefer-dataset': 'off', // no DOM data attributes in this project
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-dom-node-append': 'off', // no DOM manipulation in this project
      'unicorn/prefer-dom-node-dataset': 'off', // no DOM data attributes in this project
      'unicorn/prefer-dom-node-remove': 'off', // no DOM manipulation in this project
      'unicorn/prefer-dom-node-text-content': 'off', // no DOM text content in this project
      'unicorn/prefer-event-key': 'off', // deprecated rule
      'unicorn/prefer-event-target': 'off', // no DOM event handling in this project
      'unicorn/prefer-exponentiation-operator': 'off', // deprecated rule
      'unicorn/prefer-export-from': 'error',
      'unicorn/prefer-flat-map': 'off', // deprecated rule; replaced by prefer-array-flat-map
      'unicorn/prefer-global-this': 'off', // no cross-environment global access needed
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-json-parse-buffer': 'off', // we don't parse JSON from Buffers
      'unicorn/prefer-keyboard-event-key': 'off', // no keyboard event handling in this project
      'unicorn/prefer-logical-operator-over-ternary': 'error',
      'unicorn/prefer-math-min-max': 'error',
      'unicorn/prefer-math-trunc': 'error',
      'unicorn/prefer-modern-dom-apis': 'off', // no DOM code in this project
      'unicorn/prefer-modern-math-apis': 'error',
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-native-coercion-functions': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-node-append': 'off', // deprecated rule
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-node-remove': 'off', // deprecated rule
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-object-has-own': 'off', // Object.prototype.hasOwnProperty is explicit and familiar
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-query-selector': 'off', // no DOM code in this project
      'unicorn/prefer-reflect-apply': 'off', // too opinionated; fn.apply is readable and common
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/prefer-replace-all': 'off', // deprecated rule; replaced by prefer-string-replace-all
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-set-size': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-starts-ends-with': 'off', // deprecated rule; replaced by prefer-string-starts-ends-with
      'unicorn/prefer-string-raw': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-structured-clone': 'off', // no complex object cloning needed in this project
      'unicorn/prefer-switch': 'error',
      'unicorn/prefer-ternary': 'error',
      'unicorn/prefer-text-content': 'off', // deprecated rule
      'unicorn/prefer-top-level-await': 'off', // not compatible with Jest test environment and some RN bootstrap patterns
      'unicorn/prefer-trim-start-end': 'off', // deprecated rule; replaced by prefer-string-trim-start-end
      'unicorn/prefer-type-error': 'error',
      'unicorn/prevent-abbreviations': 'off', // too aggressive; blocks common patterns like req, res, params, fn, i
      'unicorn/regex-shorthand': 'off', // deprecated rule
      'unicorn/relative-url-style': 'error',
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
      'unicorn/require-post-message-target-origin': 'off', // no postMessage usage in this project
      'unicorn/string-content': 'off', // too opinionated; string content choices are intentional
      'unicorn/switch-case-braces': 'error',
      'unicorn/template-indent': 'error',
      'unicorn/text-encoding-identifier-case': 'error',
      'unicorn/throw-new-error': 'error',
    },
  },

  // ─── 12 (unicorn subset). Rules added by the Oct 2026 dependency updates ──
  // Disabled pending individual evaluation, which preserves prior lint
  // behavior exactly (none of them were applied before).
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    plugins: {unicorn: unicornPlugin},
    rules: {
      // eslint-plugin-unicorn 65 additions
      'unicorn/better-dom-traversing': 'off',
      'unicorn/consistent-assert': 'off',
      'unicorn/consistent-compound-words': 'off',
      'unicorn/consistent-date-clone': 'off',
      'unicorn/consistent-json-file-read': 'off',
      'unicorn/consistent-template-literal-escape': 'off',
      'unicorn/dom-node-dataset': 'off',
      'unicorn/isolated-functions': 'off',
      'unicorn/no-accessor-recursion': 'off',
      'unicorn/no-array-fill-with-reference-type': 'off',
      'unicorn/no-array-from-fill': 'off',
      'unicorn/no-array-reverse': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-blob-to-file': 'off',
      'unicorn/no-canvas-to-image': 'off',
      'unicorn/no-confusing-array-splice': 'off',
      'unicorn/no-duplicate-set-values': 'off',
      'unicorn/no-exports-in-scripts': 'off',
      'unicorn/no-immediate-mutation': 'off',
      'unicorn/no-incorrect-query-selector': 'off',
      'unicorn/no-instanceof-builtins': 'off',
      'unicorn/no-invalid-file-input-accept': 'off',
      'unicorn/no-late-current-target-access': 'off',
      'unicorn/no-manually-wrapped-comments': 'off',
      'unicorn/no-named-default': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/no-unnecessary-array-flat-depth': 'off',
      'unicorn/no-unnecessary-array-splice-count': 'off',
      'unicorn/no-unnecessary-nested-ternary': 'off',
      'unicorn/no-unnecessary-slice-end': 'off',
      'unicorn/no-unused-array-method-return': 'off',
      'unicorn/no-useless-collection-argument': 'off',
      'unicorn/no-useless-error-capture-stack-trace': 'off',
      'unicorn/no-useless-iterator-to-array': 'off',
      'unicorn/prefer-array-last-methods': 'off',
      'unicorn/prefer-bigint-literals': 'off',
      'unicorn/prefer-class-fields': 'off',
      'unicorn/prefer-classlist-toggle': 'off',
      'unicorn/prefer-get-or-insert-computed': 'off',
      'unicorn/prefer-https': 'off',
      'unicorn/prefer-import-meta-properties': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/prefer-iterator-concat': 'off',
      'unicorn/prefer-iterator-to-array-at-end': 'off',
      'unicorn/prefer-math-abs': 'off',
      'unicorn/prefer-queue-microtask': 'off',
      'unicorn/prefer-response-static-json': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-single-call': 'off',
      'unicorn/prefer-split-limit': 'off',
      'unicorn/prefer-string-match-all': 'off',
      'unicorn/prefer-string-pad-start-end': 'off',
      'unicorn/prefer-string-repeat': 'off',
      'unicorn/require-css-escape': 'off',
      'unicorn/require-module-attributes': 'off',
      'unicorn/require-module-specifiers': 'off',
      'unicorn/require-passive-events': 'off',
      'unicorn/switch-case-break-position': 'off',
      'unicorn/try-complexity': 'off',
    },
  },
];

export default unicorn;
