import nPlugin from 'eslint-plugin-n';
import type {Linter} from 'eslint';

/**
 * Node.js rules (eslint-plugin-n) for server code — RULES ONLY.
 *
 * Ported from section 6 of Eciperay's eslint.config.ts, plus the n
 * entries from section 12 (rules added by the Oct 2026 plugin bump,
 * disabled pending individual evaluation).
 *
 * This export deliberately carries NO `files:` globs (Stephen,
 * 2026-10-24: the shared config must not bake in any repo's directory
 * layout). Spreading it bare would apply the server rules everywhere —
 * including the core-rule overrides in the first block (max-lines 220,
 * classes allowed for Error subclasses) — so always attach your own
 * paths. In Eciperay:
 *
 * ```ts
 * ...node.map(block => ({
 *   ...block,
 *   files: ['packages/server/**', 'packages/mcp-server/**'],
 * })),
 * ```
 */
export const node: Linter.Config[] = [
  {
    plugins: {n: nPlugin},
    rules: {
      'max-lines': [
        'error',
        {max: 220, skipBlankLines: true, skipComments: true},
      ],
      'max-lines-per-function': 'off', // route factories register many handlers in one function
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration:not([superClass.name="Error"])',
          message: 'Classes are not allowed except Error subclasses.',
        },
      ],
      'n/callback-return': 'off', // we don't use callback-style async; Express uses async/await
      'n/exports-style': 'off', // we use ESM; CommonJS exports are not used
      'n/file-extension-in-import': 'off', // TypeScript handles extension resolution with NodeNext
      'n/global-require': 'off', // covered by import-x/no-commonjs; require is not used
      'n/handle-callback-err': 'off', // we don't use callback-style async
      'n/hashbang': 'error',
      'n/no-callback-literal': 'off', // we don't use callback-style async
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-extraneous-import': 'off', // npm workspace symlinks cause false positives for @eciperay/* packages
      'n/no-extraneous-require': 'off', // we don't use require
      'n/no-missing-import': 'off', // TypeScript and NodeNext resolution handle this
      'n/no-missing-require': 'off', // we don't use require
      'n/no-mixed-requires': 'off', // we don't use require
      'n/no-new-require': 'off', // we don't use require
      'n/no-path-concat': 'off', // we use path.join and URL constructors instead
      'n/no-process-env': 'off', // process.env is the standard config mechanism in this project
      'n/no-process-exit': 'error',
      'n/no-restricted-import': 'off', // no import restrictions beyond those in import-x/order
      'n/no-restricted-require': 'off', // we don't use require
      'n/no-sync': 'off', // sync operations are acceptable in migration scripts (not hot-path server code)
      'n/no-top-level-await': 'off', // we use top-level await in migrate.ts (a script, not a server module)
      'n/no-unpublished-bin': 'off', // not a publishable package
      'n/no-unpublished-import': 'off', // workspace packages appear unpublished to this rule
      'n/no-unpublished-require': 'off', // we don't use require
      'n/no-unsupported-features/es-builtins': 'off', // TypeScript tsconfig targets control ES feature availability
      'n/no-unsupported-features/es-syntax': 'off', // TypeScript compilation handles syntax compatibility
      'n/no-unsupported-features/node-builtins': 'off', // we target the current Node.js LTS version
      'n/prefer-global/buffer': 'off', // no preference; global Buffer is fine on the server
      'n/prefer-global/console': 'off', // no preference; global console is fine on the server
      'n/prefer-global/crypto': 'off', // no preference; global crypto is fine on Node 21+
      'n/prefer-global/process': 'off', // no preference; global process is fine on the server
      'n/prefer-global/text-decoder': 'off', // no preference; global TextDecoder is fine on Node 18+
      'n/prefer-global/text-encoder': 'off', // no preference; global TextEncoder is fine on Node 18+
      'n/prefer-global/timers': 'off', // no preference; global timers are fine on the server
      'n/prefer-global/url': 'off', // no preference; global URL is fine on Node 10+
      'n/prefer-global/url-search-params': 'off', // no preference; global URLSearchParams is fine on Node 10+
      'n/prefer-node-protocol': 'error',
      'n/prefer-promises/dns': 'off', // no DNS lookups in this project
      'n/prefer-promises/fs': 'error',
      'n/process-exit-as-throw': 'error',
    },
  },

  // ─── 12 (n subset). Rules added by the Oct 2026 dependency updates ────────
  // Disabled pending individual evaluation, which preserves prior lint
  // behavior exactly (none of them were applied before).
  {
    plugins: {n: nPlugin},
    rules: {
      // eslint-plugin-n additions
      'n/prefer-import/assert-strict': 'off',
      'n/prefer-process-get-builtin-module': 'off',
    },
  },
];

export default node;
