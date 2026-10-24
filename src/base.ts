import eslintCommentsPlugin from '@eslint-community/eslint-plugin-eslint-comments';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import type {Linter} from 'eslint';

import coverageIgnore from './coverage-ignore.js';
import importX from './import-x.js';
import unicorn from './unicorn.js';

/**
 * Base config: everything every Spudly repo shares, in one array --
 * the core ESLint rule set, the JS-file re-enables, import-x, unicorn,
 * the CommonJS config-file overrides, the eslint-comments discipline
 * rules, the coverage-ignore discipline rule, and
 * eslint-config-prettier (last).
 *
 * Ported from sections 1, 1b, 3, 4, 4a, 10, 11, and 13 of Eciperay's
 * eslint.config.ts. Every rule is explicitly configured with the
 * rationale recorded inline, exactly as in the source config.
 *
 * The import-x / unicorn / CommonJS-overrides / coverage-ignore pieces
 * used to be separate exports; Stephen directed (2026-10-24) that they
 * fold into `base` so consumers compose a handful of exports, not a
 * dozen. Rule groups that need DIRECTORY scoping (the `node` server
 * rules) deliberately stay OUT of `base`: this package carries no
 * repo-layout `files:` globs, so scoped groups remain their own
 * exports and each consuming repo attaches its own paths.
 *
 * This export intentionally does NOT include the global TypeScript
 * ignores: until typescript-eslint supports TypeScript 7, TS files are
 * not linted anywhere. Consumers that want that behavior today add
 * `typescriptPendingIgnores` from '@spudly/eslint-config/typescript'
 * (see the README for the restore path).
 */
const baseCore: Linter.Config[] = [
  {
    // typescript-eslint is uninstalled pending its TS7 support. Its rules
    // are gone, so the inline eslint-disable directives naming
    // @typescript-eslint/* rules no longer suppress anything; don't fail
    // --max-warnings 0 on them until the plugin returns and the directives
    // are live again.
    linterOptions: {reportUnusedDisableDirectives: 'off'},
  },

  // ─── 1. Core ESLint rules — all 292 built-in rules explicitly configured ───
  // Applies to ALL file types: TypeScript, JavaScript, CommonJS, and ESM.
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    rules: {
      // ── Design principles ──────────────────────────────────────────────────
      'max-lines': [
        'error',
        {max: 150, skipBlankLines: true, skipComments: true},
      ],
      'max-lines-per-function': [
        'warn',
        {max: 30, skipBlankLines: true, skipComments: true},
      ],
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration',
          message:
            'Classes are not allowed. Use plain functions and objects instead.',
        },
      ],

      // ── Possible errors / correctness ──────────────────────────────────────
      'arrow-body-style': 'off', // too opinionated; Prettier handles arrow function body formatting
      'array-callback-return': 'error',
      'no-const-assign': 'error', // recommended
      'constructor-super': 'error', // recommended
      'for-direction': 'error', // recommended
      'getter-return': 'error', // recommended
      'no-async-promise-executor': 'error', // recommended
      'no-await-in-loop': 'off', // serial async in loops is sometimes intentional
      'no-case-declarations': 'error', // recommended
      'no-class-assign': 'error', // recommended; also caught by no-restricted-syntax
      'no-compare-neg-zero': 'error', // recommended
      'no-cond-assign': 'error', // recommended
      'no-constant-binary-expression': 'error', // recommended
      'no-constant-condition': 'error', // recommended
      'no-constructor-return': 'off', // no classes in this project
      'no-control-regex': 'error', // recommended
      'no-debugger': 'error', // recommended
      'no-delete-var': 'error', // recommended
      'no-dupe-args': 'error', // recommended
      'no-dupe-else-if': 'error', // recommended
      'no-dupe-keys': 'error', // recommended
      'no-duplicate-case': 'error', // recommended
      'no-duplicate-imports': 'off', // superseded by import-x/no-duplicates
      'no-empty': 'error', // recommended
      'no-empty-character-class': 'error', // recommended
      'no-empty-pattern': 'error', // recommended
      'no-empty-static-block': 'error', // recommended
      'no-ex-assign': 'error', // recommended
      'no-extra-boolean-cast': 'error', // recommended
      'no-fallthrough': 'error', // recommended
      'no-func-assign': 'error', // recommended
      'no-global-assign': 'error', // recommended
      'no-import-assign': 'error', // recommended
      'no-inner-declarations': 'off', // not applicable in ESM (hoisting rules differ)
      'no-invalid-regexp': 'error', // recommended
      'no-irregular-whitespace': 'error', // recommended
      'no-loss-of-precision': 'off', // superseded by @typescript-eslint/no-loss-of-precision (off there too, TS handles it)
      'no-misleading-character-class': 'error', // recommended
      'no-new-native-nonconstructor': 'error', // recommended
      'no-nonoctal-decimal-escape': 'error', // recommended
      'no-obj-calls': 'error', // recommended
      'no-octal': 'error', // recommended
      'no-promise-executor-return': 'error', // returning from a promise executor is almost always a bug
      'no-prototype-builtins': 'error', // recommended
      'no-regex-spaces': 'error', // recommended
      'no-self-assign': 'error', // recommended
      'no-self-compare': 'error', // x === x is almost always a bug; use Number.isNaN for NaN checks
      'no-setter-return': 'error', // recommended
      'no-shadow-restricted-names': 'error', // recommended
      'no-sparse-arrays': 'error', // recommended
      'no-template-curly-in-string': 'error', // catches `${var}` in regular string literals
      'no-this-before-super': 'error', // recommended
      'no-unmodified-loop-condition': 'error', // catches likely infinite loops
      'no-unreachable': 'error', // recommended
      'no-unreachable-loop': 'error', // loop body that always exits on first iteration is a bug
      'no-unsafe-finally': 'error', // recommended
      'no-unsafe-negation': 'error', // recommended
      'no-unsafe-optional-chaining': 'error', // recommended
      'no-unused-labels': 'error', // recommended
      'no-useless-backreference': 'error', // recommended
      'no-useless-catch': 'error', // recommended
      'no-useless-escape': 'error', // recommended
      'no-with': 'error', // recommended
      'require-atomic-updates': 'off', // too strict; async race conditions are managed intentionally
      'require-yield': 'error', // recommended
      'use-isnan': 'error', // recommended
      'valid-typeof': 'error', // recommended

      // ── Best practices ─────────────────────────────────────────────────────
      'accessor-pairs': 'off', // only relevant for class-based setters/getters; no classes here
      'block-scoped-var': 'off', // we use const/let exclusively; var is prevented by no-var
      'curly': 'off', // too opinionated; Prettier handles brace formatting
      'default-case': 'off', // TypeScript exhaustiveness checking handles switch completeness
      'default-case-last': 'error', // default should come last in a switch statement
      'eqeqeq': 'error', // always use === / !==
      'grouped-accessor-pairs': 'off', // no class-based getters/setters
      'guard-for-in': 'off', // we use for...of; unicorn/no-for-loop prevents for...in on arrays
      'logical-assignment-operators': 'off', // too opinionated; ||=, &&=, ??= can obscure intent
      'no-alert': 'off', // React Native uses a different Alert API; no browser alert
      'no-bitwise': 'off', // bitwise operators are rare but sometimes legitimate
      'no-caller': 'error', // arguments.caller is deprecated and insecure
      'no-div-regex': 'off', // too opinionated; division-ambiguous regex is rare
      'no-else-return': 'off', // too opinionated; else after return aids readability sometimes
      'no-eq-null': 'off', // we use nullish coalescing and TypeScript null checks
      'no-eval': 'error', // eval is insecure and prevents optimisation
      'no-extend-native': 'error', // modifying built-in prototypes causes subtle bugs
      'no-extra-bind': 'error', // .bind() on a function that uses no `this` is pointless
      'no-extra-label': 'off', // we don't use labels
      'no-implicit-coercion': 'off', // too strict; !! and + coercions are common idioms
      'no-implicit-globals': 'off', // we use ESM; globals are not declared at the top level
      'no-iterator': 'error', // __iterator__ is deprecated
      'no-label-var': 'off', // we don't use labels
      'no-labels': 'off', // labels are not used; no-restricted-syntax can ban them if needed
      'no-lone-blocks': 'error', // unnecessary block statements add noise
      'no-multi-assign': 'off', // chained assignment is clear in some contexts
      'no-multi-str': 'error', // backslash-continuation strings are confusing; use template literals
      'no-new': 'off', // we don't instantiate classes; native constructors are fine
      'no-new-func': 'error', // new Function() is equivalent to eval; insecure
      'no-new-wrappers': 'error', // new String() / new Number() produce objects, not primitives
      'no-object-constructor': 'error', // new Object() is verbose; use {} instead
      'no-octal-escape': 'error', // octal escapes are deprecated; use unicode escapes
      'no-param-reassign': 'off', // too strict; reassigning parameters is sometimes valid
      'no-plusplus': 'off', // ++ and -- are acceptable
      'no-proto': 'error', // __proto__ is deprecated; use Object.getPrototypeOf
      'no-return-assign': 'error', // assignment in return is almost always a typo
      'no-script-url': 'off', // no HTML; javascript: URLs are not a concern
      'no-sequences': 'error', // comma operator is almost always a bug
      'no-shadow': 'off', // superseded by @typescript-eslint/no-shadow
      'no-ternary': 'off', // ternaries are useful; unicorn/no-nested-ternary limits depth
      'no-undef-init': 'error', // `let x = undefined` is redundant; use `let x`
      'no-undefined': 'off', // TypeScript types make undefined explicit; no need to ban the name
      'no-underscore-dangle': 'off', // too opinionated; _private conventions are common
      'no-unneeded-ternary': 'error', // `x === y ? true : false` → `x === y`
      'no-unused-expressions': 'off', // superseded by @typescript-eslint/no-unused-expressions
      'no-useless-assignment': 'off', // TypeScript/no-unused-vars handles unused assignments
      'no-useless-call': 'error', // fn.call(obj) when fn doesn't use `this` is pointless
      'no-useless-computed-key': 'error', // {'a': 1} when 'a' is a valid identifier → {a: 1}
      'no-useless-concat': 'error', // "a" + "b" can be written as "ab"
      'no-useless-rename': 'error', // `import {a as a}` → `import {a}`
      'no-useless-return': 'error', // return at the end of a void function is noise
      'no-var': 'error', // always use const or let
      'no-void': 'off', // we use void to intentionally discard promise return values
      'no-warning-comments': 'off', // TODO/FIXME comments are acceptable for tracking work
      'object-shorthand': 'error', // {a: a} → {a}
      'one-var': 'off', // too opinionated; separate declarations are often clearer
      'operator-assignment': 'off', // too opinionated; x = x + 1 vs x += 1 are both readable
      'prefer-arrow-callback': 'error', // use arrow functions for callbacks, not named functions
      'prefer-const': 'error', // use const when a variable is never reassigned
      'prefer-exponentiation-operator': 'error', // Math.pow(x, 2) → x ** 2
      'prefer-named-capture-group': 'off', // named capture groups are good practice but not required
      'prefer-numeric-literals': 'error', // parseInt("ff", 16) → 0xFF where applicable
      'prefer-object-spread': 'error', // Object.assign({}, x) → {...x}
      'prefer-regex-literals': 'off', // new RegExp() is sometimes needed for dynamic patterns
      'prefer-rest-params': 'error', // use ...args instead of the arguments object
      'prefer-spread': 'error', // fn.apply(null, args) → fn(...args)
      'prefer-template': 'error', // "hello " + name → `hello ${name}`
      'preserve-caught-error': 'error', // ensures the caught error variable is actually used
      'radix': 'error', // always pass a radix to parseInt
      'require-await': 'off', // superseded by @typescript-eslint/require-await
      'require-unicode-regexp': 'off', // unicode flag is not always needed
      'sort-imports': 'off', // handled by import-x/order
      'sort-keys': 'off', // too opinionated; logical grouping is preferable to alphabetical
      'sort-vars': 'off', // too opinionated
      'strict': 'off', // ESM uses strict mode implicitly
      'symbol-description': 'error', // Symbol() → Symbol('description') for debuggability
      'unicode-bom': 'error', // prevent byte-order-mark from appearing in source files
      'vars-on-top': 'off', // we use const/let; var is banned by no-var
      'yoda': 'off', // Prettier and TypeScript typing make yoda conditions rare and obvious

      // ── Rules superseded by @typescript-eslint equivalents ─────────────────
      // These are turned off because the @typescript-eslint versions are type-aware
      // and configured in section 2. Enabling both would cause duplicate reports.
      'camelcase': 'off', // superseded by @typescript-eslint/naming-convention
      'class-methods-use-this': 'off', // superseded by @typescript-eslint/class-methods-use-this
      'consistent-return': 'off', // superseded by @typescript-eslint/consistent-return
      'default-param-last': 'off', // superseded by @typescript-eslint/default-param-last
      'dot-notation': 'off', // superseded by @typescript-eslint/dot-notation
      'init-declarations': 'off', // superseded by @typescript-eslint/init-declarations
      'max-params': 'off', // superseded by @typescript-eslint/max-params (set to max: 4)
      'no-array-constructor': 'off', // superseded by @typescript-eslint/no-array-constructor
      'no-dupe-class-members': 'off', // superseded by @typescript-eslint/no-dupe-class-members
      'no-empty-function': 'off', // superseded by @typescript-eslint/no-empty-function
      'no-implied-eval': 'off', // superseded by @typescript-eslint/no-implied-eval
      'no-invalid-this': 'off', // superseded by @typescript-eslint/no-invalid-this
      'no-loop-func': 'off', // superseded by @typescript-eslint/no-loop-func
      'no-magic-numbers': 'off', // superseded by @typescript-eslint/no-magic-numbers
      'no-redeclare': 'off', // superseded by @typescript-eslint/no-redeclare
      'no-restricted-imports': 'off', // superseded by @typescript-eslint/no-restricted-imports
      'no-throw-literal': 'off', // superseded by @typescript-eslint/only-throw-error
      'no-undef': 'off', // superseded by TypeScript itself (more accurate than ESLint)
      'no-unused-private-class-members': 'off', // superseded by @typescript-eslint/no-unused-private-class-members
      'no-unused-vars': 'off', // superseded by @typescript-eslint/no-unused-vars
      'no-use-before-define': 'off', // superseded by @typescript-eslint/no-use-before-define
      'no-useless-constructor': 'off', // superseded by @typescript-eslint/no-useless-constructor
      'prefer-destructuring': 'off', // superseded by @typescript-eslint/prefer-destructuring
      'prefer-promise-reject-errors': 'off', // superseded by @typescript-eslint/prefer-promise-reject-errors

      // ── Complexity / style rules handled by other means ────────────────────
      'capitalized-comments': 'off', // too opinionated; comment style varies legitimately
      'complexity': 'off', // max-lines-per-function and max-lines enforce function simplicity
      'consistent-this': 'off', // we never use `this` (no class components, no OOP)
      'func-name-matching': 'off', // too opinionated; function naming is context-dependent
      'func-names': 'off', // arrow functions are anonymous by design; names come from assignment
      'func-style': 'off', // too opinionated; arrow functions are used by convention
      'id-denylist': 'off', // no specific identifier restrictions
      'id-length': 'off', // too opinionated; short names like `i`, `e`, `fn` are valid
      'id-match': 'off', // no naming pattern restrictions beyond what TypeScript enforces
      'max-classes-per-file': 'off', // no-restricted-syntax already bans all class declarations
      'max-depth': 'off', // max-lines-per-function enforces function complexity adequately
      'max-nested-callbacks': 'off', // async/await eliminates callback nesting in this project
      'max-statements': 'off', // max-lines-per-function is a better proxy for function complexity
      'new-cap': 'off', // we use arrow functions for components; class constructors are banned
      'no-continue': 'off', // too opinionated; continue is sometimes cleaner than nested if
      'no-inline-comments': 'off', // inline comments above code are acceptable
      'no-lonely-if': 'off', // superseded by unicorn/no-lonely-if
      'no-negated-condition': 'off', // superseded by unicorn/no-negated-condition
      'no-nested-ternary': 'off', // superseded by unicorn/no-nested-ternary
      'no-restricted-exports': 'off', // no export restrictions beyond ES module conventions
      'no-restricted-globals': 'off', // no specific global variable restrictions
      'no-restricted-properties': 'off', // no specific property access restrictions
      'no-unassigned-vars': 'off', // TypeScript handles unused variable declarations
      'prefer-object-has-own': 'off', // not enforced (its former unicorn replacement was removed upstream in unicorn 65)
    },
  },

  // ─── 1b. JS files — re-enable base rules superseded by @typescript-eslint ──
  // Section 1 turns these off because @typescript-eslint handles them for .ts
  // files. For .js/.cjs/.mjs files there is no TypeScript parser, so the base
  // ESLint rules must do the job.
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      'default-param-last': 'error',
      'dot-notation': 'warn',
      'max-params': ['error', {max: 4}],
      'no-array-constructor': 'error',
      'no-empty-function': 'warn',
      'no-implied-eval': 'error',
      'no-redeclare': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-unused-vars': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'error',
    },
  },
];

/**
 * CommonJS config-file overrides (section 4a of Eciperay's config).
 *
 * Metro, Babel, and Jest config files use CommonJS (`require` /
 * `module.exports`). Section 1b re-enables `no-undef` for .js/.cjs/.mjs;
 * Node globals cover `require`, `module`, and `process` here.
 *
 * Internal to `base`: it must come AFTER the import-x and unicorn
 * sections inside the base array, which is why `base` is composed at
 * the bottom of this file rather than being a single literal.
 */
const commonjsOverrides: Linter.Config[] = [
  {
    files: ['**/*.cjs'],
    languageOptions: {globals: globals.node},
    rules: {'import-x/no-commonjs': 'off', 'unicorn/prefer-module': 'off'},
  },
];

const eslintComments: Linter.Config[] = [
  // ─── 11. eslint-comments — require a reason on every inline disable ────────
  // Enforces `// eslint-disable-next-line rule -- reason` so suppressions are
  // always self-documenting. Applies everywhere.
  {
    plugins: {'eslint-comments': eslintCommentsPlugin},
    rules: {
      'eslint-comments/disable-enable-pair': 'off', // targeted next-line disables don't need a matching enable
      'eslint-comments/no-aggregating-enable': 'off', // not using block-level enables
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-restricted-disable': 'off', // no restricted rules
      'eslint-comments/no-unlimited-disable': 'off', // unicorn/no-abusive-eslint-disable already requires rule names
      'eslint-comments/no-unused-enable': 'error',
      'eslint-comments/no-use': 'off', // disables are allowed; we just require descriptions
      'eslint-comments/require-description': 'error', // every disable must explain why -- like this
    },
  },
];

/**
 * The shared base, composed in the order Stephen's export surface
 * promises: core, import-x, unicorn, CommonJS overrides (after
 * import-x/unicorn), eslint-comments, coverage-ignore, and Prettier
 * last.
 */
export const base: Linter.Config[] = [
  ...baseCore,
  ...importX,
  ...unicorn,
  ...commonjsOverrides,
  ...eslintComments,
  ...coverageIgnore,
  // --- 13. Prettier -- last, disables formatting conflicts ---
  prettier,
];

export default base;
