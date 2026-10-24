/**
 * @spudly/eslint-config — shared ESLint 10 flat config for Spudly repos.
 *
 * Compose the pieces you need, in this order:
 *
 * ```ts
 * import {
 *   base,
 *   commonjsOverrides,
 *   importX,
 *   jest,
 *   node,
 *   react,
 *   reactNative,
 *   tailwind,
 *   typescriptPendingIgnores,
 *   unicorn,
 * } from '@spudly/eslint-config';
 *
 * export default [
 *   ...typescriptPendingIgnores, // until typescript-eslint supports TS7
 *   ...base,
 *   ...importX,
 *   ...unicorn,
 *   ...commonjsOverrides, // must come after importX + unicorn
 *   ...react,
 *   ...reactNative,
 *   ...node,
 *   ...jest,
 *   ...tailwind,
 * ];
 * ```
 *
 * Each piece is also available as a subpath import, e.g.
 * `import base from '@spudly/eslint-config/base'`.
 */
export {base, commonjsOverrides} from './base.js';
export {default as importX} from './import-x.js';
export {default as jest} from './jest.js';
export {default as node} from './node.js';
export {default as react} from './react.js';
export {default as reactNative} from './react-native.js';
export {default as tailwind} from './tailwind.js';
export {default as typescriptPendingIgnores} from './typescript.js';
export {default as unicorn} from './unicorn.js';
