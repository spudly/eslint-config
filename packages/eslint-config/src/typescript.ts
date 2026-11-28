import type {Linter} from 'eslint';
import tseslint from 'typescript-eslint';

/**
 * TypeScript — the real typescript-eslint section, RESTORED under the
 * side-by-side TypeScript 6 / TypeScript 7 shape (issue #67,
 * Stephen's 2026-11-27 direction).
 *
 * History: typescript-eslint was uninstalled pending TypeScript 7
 * support and this subpath shipped only `typescriptPendingIgnores`
 * (below). That wait was unnecessary: typescript-eslint resolves the
 * consumer's `typescript` package, and under the side-by-side shape
 * that package is TypeScript 6 (aliased to @typescript/typescript6,
 * which satisfies typescript-eslint's `typescript <6.1.0` peer cap),
 * while compilation/typecheck runs the TypeScript 7 compiler from
 * the `typescript7` alias by path. Verified empirically 2026-11-27:
 * clean install, and type-aware rules fire via `projectService`. The
 * parser building its programs with the TS 6 API is the accepted
 * trade-off of the side-by-side shape (same shape as reactPending,
 * issue #8). See the README's TypeScript section for the consumer
 * setup.
 *
 * The rule set is ported from section 2 of Eciperay's
 * pre-extraction eslint.config.ts — all rules explicitly configured,
 * severities and rationale comments preserved. Two reconciliations
 * against the installed typescript-eslint 8.74.0, per this package's
 * check-rules policy (deprecated rules are removed, every available
 * rule gets an explicit entry):
 * - Nine rules deprecated in 8.74.0 are dropped: no-empty-interface
 *   (superseded by no-empty-object-type, kept below),
 *   no-loss-of-precision and no-loop-func and no-restricted-imports
 *   (superseded by the core rules of the same name in `base`),
 *   no-type-alias (superseded by consistent-type-definitions),
 *   no-var-requires (superseded by no-require-imports),
 *   prefer-ts-expect-error (superseded by ban-ts-comment),
 *   sort-type-constituents (no successor in this package), and
 *   typedef (upstream: no longer recommended).
 * - Three rules new since the port source are added at 'error' with
 *   the no-unsafe family they belong to: no-generated-empty-object-type,
 *   no-unsafe-class-instance-assignment, no-unsafe-enum-assignment.
 *
 * Parser options: `projectService: true` with no baked-in
 * `tsconfigRootDir` — this package carries no repo-layout paths, so
 * the project service discovers each consumer's own tsconfig;
 * consumers whose layout needs it override `tsconfigRootDir` in a
 * local block.
 */
export const typescript: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {'@typescript-eslint': tseslint.plugin},
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {projectService: true},
    },
    rules: {
      // @typescript-eslint — every rule in the installed plugin explicitly
      // configured (the port's 134, minus the nine deprecated in 8.74.0,
      // plus the three added since the port source — see the header)
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {'ts-expect-error': true, 'ts-ignore': true, 'ts-nocheck': true},
      ],
      '@typescript-eslint/ban-tslint-comment': 'warn',
      '@typescript-eslint/class-literal-property-style': 'warn',
      '@typescript-eslint/class-methods-use-this': 'off', // no classes in this project
      '@typescript-eslint/consistent-generic-constructors': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/consistent-return': 'off', // TypeScript return-type inference handles this
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-exports': 'off', // verbatimModuleSyntax in tsconfig handles this
      '@typescript-eslint/consistent-type-imports': 'off', // verbatimModuleSyntax in tsconfig handles this
      '@typescript-eslint/default-param-last': 'off', // we prefer options objects over many params
      '@typescript-eslint/dot-notation': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off', // TypeScript infers return types; explicit annotation is noisy
      '@typescript-eslint/explicit-member-accessibility': 'off', // no classes in this project
      '@typescript-eslint/explicit-module-boundary-types': 'off', // TypeScript infers types; explicit annotation is noisy
      '@typescript-eslint/init-declarations': 'off', // too strict; many valid patterns initialise later
      '@typescript-eslint/max-params': ['error', {max: 4}],
      '@typescript-eslint/member-ordering': 'off', // no classes in this project
      '@typescript-eslint/method-signature-style': 'off', // we use `type` not `interface`; not applicable
      '@typescript-eslint/naming-convention': 'off', // too opinionated; existing conventions are sufficient
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-dupe-class-members': 'off', // no classes in this project
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-generated-empty-object-type': 'error', // added at restoration (#67): type operations resolving to the empty-object type are the no-empty-object-type hazard in computed form; the no-unsafe family is 'error'
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'off', // verbatimModuleSyntax in tsconfig handles this
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-invalid-this': 'off', // we don't use `this` (no classes, no OOP)
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-magic-numbers': 'off', // too noisy in practice; constants are named where it matters
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-redeclare': 'off', // TypeScript catches duplicate declarations at compile time
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-restricted-types': 'off', // no project-specific type restrictions needed
      '@typescript-eslint/no-shadow': 'off', // TypeScript scope analysis prevents real bugs here
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'off', // no classes in this project
      '@typescript-eslint/no-unnecessary-qualifier': 'off', // we don't use namespaces
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-class-instance-assignment': 'error', // added at restoration (#67): assigning a non-instance value to a class-instance location is the no-unsafe-assignment hazard for class types; 'error' with the no-unsafe family
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-enum-assignment': 'error', // added at restoration (#67): assigning a non-enum value to an enum location is the no-unsafe-assignment hazard for enums; 'error' with the no-unsafe family
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // covered by no-explicit-any + no-unsafe-assignment
      '@typescript-eslint/no-unsafe-unary-minus': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-private-class-members': 'off', // no classes in this project
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // Underscore-prefixed names mark intentional discards. This replaces
          // the old `void x;` statements, which @typescript-eslint's
          // no-meaningless-void-operator now flags on non-call expressions.
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off', // TypeScript hoisting is safe; the pattern is valid
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-useless-default-assignment': 'error',
      '@typescript-eslint/no-useless-empty-export': 'off', // not needed in ESM with verbatimModuleSyntax
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/parameter-properties': 'off', // no classes in this project
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-destructuring': 'off', // too opinionated; destructuring is not always clearer
      '@typescript-eslint/prefer-enum-initializers': 'off', // we avoid enums in favour of plain objects/unions
      '@typescript-eslint/prefer-find': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-readonly': 'off', // too strict; mutability is fine in local scope
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // too strict and very noisy
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/promise-function-async': 'off', // too strict; sync wrappers of async functions are valid
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/require-array-sort-compare': 'off', // too strict; default numeric sort is often intentional
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/return-await': 'off', // conflicts with our try/catch patterns where returning a promise is valid
      '@typescript-eslint/strict-boolean-expressions': 'off', // too strict; idiomatic JS truthiness is intentional
      '@typescript-eslint/strict-void-return': 'off', // too strict; void callbacks are common in React event handlers
      '@typescript-eslint/switch-exhaustiveness-check': 'off', // TypeScript's never-type handles this at compile time
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
    },
  },
];

/**
 * Global ignores for TypeScript files — LEGACY / INTERIM, kept only
 * for consumers not yet on the side-by-side shape above.
 *
 * Composing this export means .ts/.tsx files are NOT linted at all.
 * Consumers on the side-by-side shape compose `typescript` instead
 * and delete this from their config array. New consumers should not
 * adopt this export.
 */
export const typescriptPendingIgnores: Linter.Config[] = [
  {
    ignores: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  },
];

export default typescript;
