/**
 * @spudly/eslint-config — shared ESLint 10 flat config for Spudly repos.
 *
 * The export list is deliberately small (Stephen, 2026-10-24): `base`
 * already contains the core rules, import-x, unicorn, the CommonJS
 * overrides, the eslint-comments discipline, and the coverage-ignore
 * rule. The remaining exports are the groups a repo opts into — or
 * that need directory scoping, which this package does NOT bake in:
 * scoped groups carry rules only, and each repo attaches its own
 * `files:` globs.
 *
 * Compose what you need, in this order:
 *
 * ```ts
 * import {
 *   base,
 *   jest,
 *   node,
 *   react,
 *   reactNative,
 *   tailwind,
 *   typescriptPendingIgnores,
 * } from '@spudly/eslint-config';
 *
 * export default [
 *   ...typescriptPendingIgnores, // until typescript-eslint supports TS7
 *   ...base,
 *   ...react,
 *   ...reactNative,
 *   // `node` carries no paths: attach your own server directories.
 *   ...node.map(block => ({
 *     ...block,
 *     files: ['packages/server/**', 'packages/mcp-server/**'],
 *   })),
 *   ...jest,
 *   ...tailwind,
 * ];
 * ```
 *
 * Each export is also available as a subpath import, e.g.
 * `import base from '@spudly/eslint-config/base'`.
 */
export {base} from './base.js';
export {default as jest} from './jest.js';
export {default as node} from './node.js';
export {default as react} from './react.js';
export {default as reactNative} from './react-native.js';
export {default as tailwind} from './tailwind.js';
export {default as typescriptPendingIgnores} from './typescript.js';
