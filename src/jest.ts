import jestPlugin from 'eslint-plugin-jest';
import type {Linter} from 'eslint';

/**
 * Jest rules for test files and setup files.
 *
 * Ported from section 7 of Eciperay's eslint.config.ts, plus the jest
 * entries from section 12 (rules added by the Oct 2026 plugin bump,
 * disabled pending individual evaluation).
 *
 * Scoping: the `files` globs below use only Jest-ecosystem naming
 * conventions — test/spec suffixes, `jest.setup`/`jest.env`/
 * `jest.setupEnv` filenames, and `__tests__/` (part of Jest's default
 * testMatch). This package carries no repo-layout globs (Stephen,
 * 2026-10-24), so Eciperay's `src/test/` helper directory is NOT
 * covered here: repos whose test helpers live in a named directory
 * attach their own block with the same rules (or reuse this export's
 * blocks with their paths mapped on). Every rule is explicitly
 * configured with its rationale inline.
 */
export const jest: Linter.Config[] = [
  {
    files: [
      '**/*.test.{ts,js,tsx,jsx,cjs}',
      '**/*.spec.{ts,js}',
      '**/jest.setup.{ts,js,cjs}',
      '**/jest.env.{ts,js}',
      '**/jest.setupEnv.{ts,js}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}', // shared fixtures
    ],
    plugins: {jest: jestPlugin},
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        require: 'readonly', // allowed in jest.mock() factories and setup files
        process: 'readonly', // Node.js global; not in the `n` plugin scope for .js setup files
        queueMicrotask: 'readonly', // browser/Node.js 11+ global used in jest.setup.js
      },
    },
    rules: {
      // relax line-length limits for test files (tests are naturally verbose)
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-restricted-syntax': 'off', // mock classes and test doubles are acceptable
      'unicorn/consistent-function-scoping': 'off', // test helpers nested in describe are fine
      'no-empty-function': 'off', // jest mock implementations may intentionally be empty

      // test files frequently access `res.body` (typed as any by supertest) and
      // JSON.parse results — relaxing unsafe rules in test scope is intentional

      // jest.mock() factories run before imports resolve, so require() is the only
      // way to load modules inside them — especially when top-level imports are out-of-scope
      'unicorn/prefer-module': 'off',
      'import-x/no-commonjs': 'off',

      // jest — all 63 rules
      'jest/consistent-test-it': 'off', // both `test` and `it` are acceptable
      'jest/expect-expect': 'warn',
      'jest/max-expects': 'off', // not limiting expects per test; clarity over brevity
      'jest/max-nested-describe': 'off', // not limiting describe nesting depth
      'jest/no-alias-methods': 'error',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-conditional-in-test': 'off', // some conditional logic in test setup is acceptable
      'jest/no-confusing-set-timeout': 'off', // not using setTimeout in tests
      'jest/no-deprecated-functions': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-done-callback': 'error',
      'jest/no-duplicate-hooks': 'off', // multiple beforeEach in different describe blocks is acceptable
      'jest/no-export': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-hooks': 'off', // beforeEach/afterEach are acceptable for setup/teardown
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-large-snapshots': 'off', // snapshot size is not limited; we prefer explicit assertions
      'jest/no-mocks-import': 'error',
      'jest/no-restricted-jest-methods': 'off', // no method restrictions beyond the defaults
      'jest/no-restricted-matchers': 'off', // no matcher restrictions beyond the defaults
      'jest/no-standalone-expect': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/no-test-return-statement': 'off', // returning a value from a test is acceptable
      'jest/no-untyped-mock-factory': 'off', // TypeScript types on mocks are added when needed
      'jest/padding-around-after-all-blocks': 'off', // stylistic; not enforced
      'jest/padding-around-after-each-blocks': 'off', // stylistic; not enforced
      'jest/padding-around-all': 'off', // stylistic; not enforced
      'jest/padding-around-before-all-blocks': 'off', // stylistic; not enforced
      'jest/padding-around-before-each-blocks': 'off', // stylistic; not enforced
      'jest/padding-around-describe-blocks': 'off', // stylistic; not enforced
      'jest/padding-around-expect-groups': 'off', // stylistic; not enforced
      'jest/padding-around-test-blocks': 'off', // stylistic; not enforced
      'jest/prefer-called-with': 'off', // toHaveBeenCalled is acceptable when exact args don't matter
      'jest/prefer-comparison-matcher': 'off', // toBeGreaterThan etc. are acceptable alternatives
      'jest/prefer-each': 'off', // test.each is not required; individual tests are fine
      'jest/prefer-ending-with-an-expect': 'off', // some tests assert via side effects
      'jest/prefer-equality-matcher': 'off', // toBe is acceptable alongside toEqual
      'jest/prefer-expect-assertions': 'off', // too strict; we rely on test structure for assertion coverage
      'jest/prefer-expect-resolves': 'off', // await-based assertions are acceptable
      'jest/prefer-hooks-in-order': 'off', // hook order is enforced by convention, not lint
      'jest/prefer-hooks-on-top': 'off', // hooks grouped with the tests they apply to is acceptable
      'jest/prefer-importing-jest-globals': 'off', // globals are available without importing in our Jest config
      'jest/prefer-jest-mocked': 'off', // manual type assertions on mocks are acceptable
      'jest/prefer-lowercase-title': 'off', // test titles may start with uppercase (e.g. component names)
      'jest/prefer-mock-promise-shorthand': 'off', // explicit mockResolvedValue is often clearer
      'jest/prefer-snapshot-hint': 'off', // we prefer explicit assertions over snapshots
      'jest/prefer-spy-on': 'off', // jest.fn() is acceptable alongside jest.spyOn()
      'jest/prefer-strict-equal': 'off', // toEqual is acceptable; toStrictEqual is used when prototype matters
      'jest/prefer-to-be': 'off', // toEqual is acceptable; toBe is used when reference equality matters
      'jest/prefer-to-contain': 'off', // manual array checks are acceptable
      'jest/prefer-to-have-length': 'off', // length checks via toEqual are acceptable
      'jest/prefer-todo': 'off', // test.skip is acceptable for placeholder tests
      'jest/require-hook': 'off', // setup outside hooks is acceptable for simple cases
      'jest/require-to-throw-message': 'off', // toThrow without message is acceptable
      'jest/require-top-level-describe': 'off', // top-level tests without describe are acceptable
      'jest/unbound-method': 'off', // @typescript-eslint/unbound-method handles this globally
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/valid-title': 'error',
    },
  },

  // ─── 12 (jest subset). Rules added by the Oct 2026 dependency updates ─────
  // Disabled pending individual evaluation, which preserves prior lint
  // behavior exactly (none of them were applied before).
  {
    files: ['**/*.test.{ts,js,tsx,jsx,cjs}', '**/*.spec.{ts,js}'],
    plugins: {jest: jestPlugin},
    rules: {
      // eslint-plugin-jest additions
      'jest/no-error-equal': 'off',
      'jest/no-unnecessary-assertion': 'off',
      'jest/no-unneeded-async-expect-function': 'off',
      'jest/prefer-mock-return-shorthand': 'off',
      'jest/prefer-to-have-been-called-times': 'off',
      'jest/prefer-to-have-been-called': 'off',
      'jest/valid-expect-with-promise': 'off',
      'jest/valid-mock-module-path': 'off',
    },
  },
];

export default jest;
