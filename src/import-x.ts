import importXPlugin from 'eslint-plugin-import-x';
import type {Linter} from 'eslint';

/**
 * import-x rules for all packages.
 *
 * Ported from section 3 of Eciperay's eslint.config.ts (plus the 8b
 * web/client no-cycle relaxation, generalized to web/client directories).
 * Every rule is explicitly configured with its rationale inline.
 */
export const importX: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    plugins: {'import-x': importXPlugin},
    settings: {
      // react-native/index.js ships Flow-typed source that the TypeScript parser
      // cannot handle. Tell import-x to skip it rather than attempting to parse it.
      'import-x/ignore': ['node_modules/react-native/.*\\.js$'],
    },
    rules: {
      'import-x/consistent-type-specifier-style': 'off', // verbatimModuleSyntax in tsconfig handles type imports
      'import-x/default': 'off', // TypeScript checks default export compatibility
      'import-x/dynamic-import-chunkname': 'off', // not using webpack; Metro handles chunks
      'import-x/export': 'off', // TypeScript catches duplicate exports at compile time
      'import-x/exports-last': 'off', // stylistic preference; not enforced
      'import-x/extensions': 'off', // TypeScript and Metro handle extension resolution
      'import-x/first': 'error',
      'import-x/group-exports': 'off', // stylistic preference; not enforced
      'import-x/imports-first': 'off', // deprecated alias for import-x/first
      'import-x/max-dependencies': 'off', // too strict; large modules are split by max-lines instead
      'import-x/named': 'off', // TypeScript checks named export compatibility
      'import-x/namespace': 'off', // TypeScript checks namespace import compatibility
      'import-x/newline-after-import': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-amd': 'error',
      'import-x/no-anonymous-default-export': 'off', // React components use named exports; not an issue
      'import-x/no-commonjs': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'off', // React components and some server modules require default exports
      'import-x/no-deprecated': 'off', // @typescript-eslint/no-deprecated covers this via type information
      'import-x/no-duplicates': 'error',
      'import-x/no-dynamic-require': 'off', // covered by no-commonjs and unicorn/prefer-module
      'import-x/no-empty-named-blocks': 'error',
      'import-x/no-extraneous-dependencies': 'off', // npm workspace symlinks cause false positives
      'import-x/no-import-module-exports': 'error',
      'import-x/no-internal-modules': 'off', // no specific module boundary restrictions in this project
      'import-x/no-mutable-exports': 'off', // mutable exports are rare; no-unsafe-assignment covers accidental mutation
      'import-x/no-named-as-default': 'off', // TypeScript catches incorrect default import usage
      'import-x/no-named-as-default-member': 'off', // TypeScript catches incorrect member access
      'import-x/no-named-default': 'error',
      'import-x/no-named-export': 'off', // we primarily use named exports; this rule would always fire
      'import-x/no-namespace': 'off', // namespace imports are acceptable for type-only use
      'import-x/no-nodejs-modules': 'off', // server legitimately uses Node.js built-in modules
      'import-x/no-relative-packages': 'off', // workspace packages use @eciperay/* scoped imports; not relative
      'import-x/no-relative-parent-imports': 'off', // parent imports are acceptable in this project structure
      'import-x/no-rename-default': 'off', // renaming default imports is acceptable
      'import-x/no-restricted-paths': 'off', // no cross-package path restrictions needed
      'import-x/no-self-import': 'error',
      'import-x/no-unassigned-import': 'off', // side-effect imports (e.g. dotenv/config) are intentional
      'import-x/no-unresolved': 'off', // TypeScript and Metro handle module resolution
      'import-x/no-unused-modules': 'off', // too noisy with declaration files and re-export barrels
      'import-x/no-useless-path-segments': 'error',
      'import-x/no-webpack-loader-syntax': 'off', // not using webpack
      'import-x/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import-x/prefer-default-export': 'off', // we prefer named exports for explicit, tree-shakeable APIs
      'import-x/prefer-namespace-import': 'off', // named imports are preferred over namespace imports
      'import-x/unambiguous': 'off', // not all files need to be explicit ES modules (e.g. config files)
    },
  },

  // ─── 8b. import-x — web/client (Vite workspace resolution) ─────────────
  {
    files: ['**/{web,client}/**/*.{ts,tsx,js,jsx}'],
    rules: {'import-x/no-cycle': 'off'},
  },
];

export default importX;
