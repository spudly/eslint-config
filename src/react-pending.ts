import reactPlugin from '@eslint-react/eslint-plugin';
import type {Linter} from 'eslint';

/**
 * The @eslint-react rule blocks — PENDING: preserved verbatim, but not
 * composed by any consumer yet. This is the React half of the interim
 * state described in src/typescript.ts, held for the same reason and
 * under the same policy (Stephen's decision, 2026-10-24: treat it
 * exactly the way typescript-eslint was treated — keep it disabled
 * until a compatible upstream version lands, and track restoration).
 *
 * Why it cannot load today (issue #8): the `react` export used to
 * register @eslint-react/eslint-plugin alongside the hooks rules.
 * That plugin's eslint-plugin-react-x member imports ts-api-utils at
 * module top level, and ts-api-utils reads `ts.TypeFlags` during
 * initialization. TypeScript 7's JS API exposes no TypeFlags, so the
 * import throws `TypeError: Cannot read properties of undefined
 * (reading 'Intrinsic')` for every consumer whose resolvable
 * typescript is 7.x — all three target repos. The rules below are
 * plain data; only the plugin import is toxic, so the full
 * configuration is preserved here with its plugin registration,
 * severities, and rationale comments intact, in an export nobody
 * composes yet. Restoration is a composition change, not a rewrite.
 *
 * Why subpath-only: this export is deliberately NOT re-exported from
 * the package root (src/index.ts). Re-exporting it would re-poison
 * every root import under TS7 — the exact failure of issue #8 — so it
 * ships only as `@spudly/eslint-config/react-pending`.
 * test/ts7Consumer.test.mjs guards both halves: the composed exports
 * must load under typescript@7, and this one must NOT (yet).
 *
 * RESTORE PATH: when an @eslint-react / eslint-plugin-react-x release
 * ships whose ts-api-utils chain initializes under TypeScript 7.x —
 * proven by the TS7 consumer fixture, whose pending tripwire flips
 * red the day this export loads — merge the block below back into
 * src/react.ts (plugin registration plus rules, alongside the hooks
 * rules), delete this file and the `./react-pending` subpath, and the
 * full React rule set returns in every consumer with one package
 * release.
 *
 * ── Migration notes (moved from src/react.ts with the rules) ──────
 *
 * The rules below were built on @eslint-react/eslint-plugin (ESLint
 * React). They are ported from sections 5 (react part) and 8c of
 * Eciperay's eslint.config.ts, which configured eslint-plugin-react.
 * That plugin has no ESLint 10 release (7.37.5 caps its peer range at
 * eslint ^9.7), so the React rules were migrated to @eslint-react
 * following ESLint React's official migration guide
 * (https://eslint-react.xyz/docs/migrating-from-eslint-plugin-react).
 *
 * House style is preserved: every @eslint-react rule is explicitly
 * listed below with a rationale comment — no preset is extended.
 * Rules that were 'error' under eslint-plugin-react stay 'error'
 * wherever an equivalent exists. @eslint-react rules with no
 * eslint-plugin-react counterpart are 'off' pending individual
 * evaluation (the same policy as section 12 of the source config).
 *
 * Dropped eslint-plugin-react rules (no @eslint-react equivalent):
 * - react/jsx-filename-extension (was error) — upstream offers this
 *   only as a custom rule via @eslint-react/kit. The .tsx-only JSX
 *   convention is unenforced for now.
 * - react/jsx-no-duplicate-props (was error) — kit-only upstream; no
 *   built-in equivalent.
 * - react/jsx-no-undef (was error) — ESLint 10 tracks JSX references
 *   natively, so the rule is unnecessary.
 * - react/jsx-uses-vars (was error) — native in ESLint 10, same reason.
 * - react/jsx-uses-react (was off) — native in ESLint 10, same reason.
 * - react/no-is-mounted (was error) — no equivalent; legacy
 *   class-component rule, and this codebase has no class components.
 * - react/no-string-refs (was error) — kit-only upstream; legacy
 *   (string refs are a pre-hooks API).
 * - react/no-unescaped-entities (was error) — no equivalent in
 *   @eslint-react. App JSX text is also policed by the vendored
 *   react-native/no-raw-text rule (see the reactNative export).
 * - react/require-render-return (was error) — no equivalent; legacy
 *   class-component rule.
 * - The prop-types family, the JSX formatting family (Prettier's
 *   job), and the remaining class-component rules that were 'off' are
 *   not carried over; the @eslint-react rule set below replaces them.
 *
 * Also dropped: `settings: {react: {version: 'detect'}}` —
 * @eslint-react does not use react version settings.
 *
 * Section 5 vs 8c in the source: the app section enabled the full
 * rule list with react-hooks/exhaustive-deps as 'error'; the web
 * section (8c) enabled a subset with exhaustive-deps as 'warn'. The
 * react-hooks rules live in src/react.ts and follow the app section;
 * consumers can override exhaustive-deps to 'warn' for web code the
 * way Eciperay did.
 */
export const reactPending: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx,jsx}'],
    plugins: {
      '@eslint-react': reactPlugin,
    },
    rules: {
      // ── @eslint-react — rules preserved as 'error' from eslint-plugin-react ──
      '@eslint-react/no-missing-component-display-name': 'error', // react/display-name (component half of the split equivalent)
      '@eslint-react/no-missing-context-display-name': 'error', // react/display-name (context half of the split equivalent)
      '@eslint-react/no-missing-key': 'error', // react/jsx-key
      '@eslint-react/jsx-no-comment-textnodes': 'error', // react/jsx-no-comment-textnodes
      '@eslint-react/jsx-no-children-prop': 'error', // react/no-children-prop
      '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error', // react/no-danger-with-children
      '@eslint-react/no-component-will-mount': 'error', // react/no-deprecated (split equivalent)
      '@eslint-react/no-component-will-receive-props': 'error', // react/no-deprecated (split equivalent)
      '@eslint-react/no-component-will-update': 'error', // react/no-deprecated (split equivalent)
      '@eslint-react/dom-no-render': 'error', // react/no-deprecated (split equivalent; ReactDOM.render removed in React 19)
      '@eslint-react/dom-no-hydrate': 'error', // react/no-deprecated (split equivalent; ReactDOM.hydrate removed in React 19)
      '@eslint-react/no-direct-mutation-state': 'error', // react/no-direct-mutation-state
      '@eslint-react/dom-no-find-dom-node': 'error', // react/no-find-dom-node
      '@eslint-react/dom-no-render-return-value': 'error', // react/no-render-return-value
      '@eslint-react/dom-no-unknown-property': 'error', // react/no-unknown-property

      // ── @eslint-react — equivalents of rules that were 'off' ─────────────
      '@eslint-react/use-state': 'off', // react/hook-use-state — too strict; destructuring names are contextually clear
      '@eslint-react/dom-no-missing-button-type': 'off', // react/button-has-type — React Native has no <button>; not applicable
      '@eslint-react/dom-no-missing-iframe-sandbox': 'off', // react/iframe-missing-sandbox — React Native has no <iframe>
      '@eslint-react/no-forward-ref': 'off', // successor to react/forward-ref-uses-ref, but a React 19 migration codemod that bans forwardRef outright — stricter than the old rule; we avoid forwardRef by convention
      '@eslint-react/no-unstable-context-value': 'off', // react/jsx-no-constructed-context-values — too strict; memoization is applied when profiling shows need
      '@eslint-react/no-leaked-conditional-rendering': 'off', // react/jsx-no-leaked-render — TypeScript types prevent most leaked render bugs
      '@eslint-react/dom-no-script-url': 'off', // react/jsx-no-script-url — React Native has no anchor or script URLs
      '@eslint-react/dom-no-unsafe-target-blank': 'off', // react/jsx-no-target-blank — React Native has no <a target="_blank">
      '@eslint-react/jsx-no-useless-fragment': 'off', // react/jsx-no-useless-fragment — sometimes fragments are added for future children; not enforced
      '@eslint-react/no-access-state-in-setstate': 'off', // react/no-access-state-in-setstate — we use functional state updates; class state is not used
      '@eslint-react/no-array-index-key': 'off', // react/no-array-index-key — acceptable when list items have no stable identity
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off', // react/no-danger — React Native has no dangerouslySetInnerHTML
      '@eslint-react/no-set-state-in-component-did-mount': 'off', // react/no-did-mount-set-state — no class components in this project
      '@eslint-react/no-set-state-in-component-did-update': 'off', // react/no-did-update-set-state — no class components in this project
      '@eslint-react/jsx-no-namespace': 'off', // react/no-namespace — we don't use React namespaces
      '@eslint-react/no-unstable-default-props': 'off', // react/no-object-type-as-default-prop — TypeScript types prevent this mistake
      '@eslint-react/no-unsafe-component-will-mount': 'off', // react/no-unsafe (split equivalent) — no class components; lifecycle methods are not used
      '@eslint-react/no-unsafe-component-will-receive-props': 'off', // react/no-unsafe (split equivalent) — no class components in this project
      '@eslint-react/no-unsafe-component-will-update': 'off', // react/no-unsafe (split equivalent) — no class components in this project
      '@eslint-react/no-nested-component-definitions': 'off', // react/no-unstable-nested-components — acceptable when components are small and co-located
      '@eslint-react/no-unused-class-component-members': 'off', // react/no-unused-class-component-methods — no class components in this project
      '@eslint-react/no-unused-props': 'off', // react/no-unused-prop-types — TypeScript types replace prop-types
      '@eslint-react/no-unused-state': 'off', // react/no-unused-state — no class components in this project
      '@eslint-react/no-set-state-in-component-will-update': 'off', // react/no-will-update-set-state — no class components in this project
      '@eslint-react/dom-no-string-style-prop': 'off', // react/style-prop-object — React Native uses style differently from the web
      '@eslint-react/dom-no-void-elements-with-children': 'off', // react/void-dom-elements-no-children — React Native has no void DOM elements

      // ── @eslint-react — no eslint-plugin-react counterpart ───────────────
      // Off pending individual evaluation (section 12 policy).
      '@eslint-react/error-boundaries': 'off', // no counterpart; pending evaluation
      '@eslint-react/exhaustive-deps': 'off', // hooks rules come from eslint-plugin-react-hooks below, not @eslint-react
      '@eslint-react/rules-of-hooks': 'off', // hooks rules come from eslint-plugin-react-hooks below, not @eslint-react
      '@eslint-react/globals': 'off', // no counterpart; pending evaluation
      '@eslint-react/immutability': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-children-count': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-children-for-each': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-children-map': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-children-only': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-children-to-array': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-class-component': 'off', // no counterpart; classes are already banned by base's no-restricted-syntax
      '@eslint-react/no-clone-element': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-context-provider': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-create-ref': 'off', // no counterpart as its own rule (part of the no-deprecated family upstream); pending evaluation
      '@eslint-react/no-duplicate-key': 'off', // part of the jsx-key family upstream, but eslint-plugin-react's jsx-key did not check duplicate keys; pending evaluation
      '@eslint-react/no-implicit-children': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-implicit-key': 'off', // part of the jsx-key family upstream, but not checked by eslint-plugin-react's jsx-key; pending evaluation
      '@eslint-react/no-implicit-ref': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-misused-capture-owner-stack': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-nested-lazy-component-declarations': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-unnecessary-use-prefix': 'off', // no counterpart; pending evaluation
      '@eslint-react/no-use-context': 'off', // no counterpart; React 19 `use` migration style rule; pending evaluation
      '@eslint-react/purity': 'off', // no counterpart; pending evaluation
      '@eslint-react/refs': 'off', // no counterpart; pending evaluation
      '@eslint-react/rsc-function-definition': 'off', // no counterpart; no React Server Components in these apps
      '@eslint-react/set-state-in-effect': 'off', // no counterpart; pending evaluation
      '@eslint-react/set-state-in-render': 'off', // no counterpart; pending evaluation
      '@eslint-react/static-components': 'off', // no counterpart; pending evaluation
      '@eslint-react/unsupported-syntax': 'off', // no counterpart; pending evaluation
      '@eslint-react/use-memo': 'off', // no counterpart; pending evaluation
      '@eslint-react/jsx-no-children-prop-with-children': 'off', // no counterpart; pending evaluation
      '@eslint-react/jsx-no-key-after-spread': 'off', // no counterpart; pending evaluation
      '@eslint-react/jsx-no-leaked-dollar': 'off', // no counterpart; pending evaluation
      '@eslint-react/jsx-no-leaked-semicolon': 'off', // no counterpart; pending evaluation
      '@eslint-react/dom-no-flush-sync': 'off', // no counterpart; pending evaluation
      '@eslint-react/dom-no-unsafe-iframe-sandbox': 'off', // no counterpart; pending evaluation
      '@eslint-react/dom-no-use-form-state': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-event-listener': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-fetch': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-intersection-observer': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-interval': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-resize-observer': 'off', // no counterpart; pending evaluation
      '@eslint-react/web-api-no-leaked-timeout': 'off', // no counterpart; pending evaluation
      '@eslint-react/naming-convention-context-name': 'off', // no counterpart; pending evaluation
      '@eslint-react/naming-convention-id-name': 'off', // no counterpart; pending evaluation
      '@eslint-react/naming-convention-ref-name': 'off', // no counterpart; pending evaluation
    },
  },
];

export default reactPending;
