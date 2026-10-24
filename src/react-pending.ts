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
 * eslint-plugin-react counterpart were held 'off' pending individual
 * evaluation (the same policy as section 12 of the source config);
 * that evaluation is COMPLETE (issue #4, 2026-10-24): each such rule
 * was trialled as 'error' against the design system's src/ tree:
 * 39 are now 'error' below with their finding counts recorded, and
 * the three type-requiring rules (no-implicit-children,
 * no-implicit-key, no-implicit-ref) stay 'off' with the
 * typed-linting rationale recorded on their entries, alongside the
 * two hooks rules and the two rules with substantive 'off' reasons
 * (no-class-component, rsc-function-definition). No undecided
 * entries remain.
 *
 * Hooks-source decision (issue #4): eslint-plugin-react-hooks stays
 * the source for the two classic hooks rules (rules-of-hooks,
 * exhaustive-deps), so @eslint-react's versions stay 'off' below.
 * For the React Compiler diagnostics that exist under both
 * namespaces (purity, immutability, refs, globals,
 * static-components, set-state-in-effect, set-state-in-render,
 * error-boundaries, unsupported-syntax, use-memo), the @eslint-react
 * versions enabled below are the single source when this export is
 * restored; the react-hooks duplicates in src/react.ts stay 'off'
 * (recorded there) so nothing double-reports.
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
      // Evaluated individually in issue #4 (trialled as 'error' against
      // the design system's src/ tree, 2026-10-24): 'error' unless a
      // substantive 'off' rationale is recorded on the entry.
      '@eslint-react/error-boundaries': 'error', // evaluated in #4: validates Error Boundary usage instead of try/catch for child errors; 0 findings in the DS trial
      '@eslint-react/exhaustive-deps': 'off', // hooks rules come from eslint-plugin-react-hooks below, not @eslint-react
      '@eslint-react/rules-of-hooks': 'off', // hooks rules come from eslint-plugin-react-hooks below, not @eslint-react
      '@eslint-react/globals': 'error', // evaluated in #4: no assignment/mutation of globals during render; 0 findings in the DS trial
      '@eslint-react/immutability': 'error', // evaluated in #4: no mutating props/state/immutable values during render; the DS trial's only findings (4) are one site — MemorizationSessionPage's blankOrdinal counter, tracked for refactor in design-system#135 before this export is restored (#8)
      '@eslint-react/no-children-count': 'error', // evaluated in #4: Children.* APIs are opaque and error-prone; use the children value directly; 0 findings in the DS trial
      '@eslint-react/no-children-for-each': 'error', // evaluated in #4: Children.* APIs are opaque and error-prone; use the children value directly; 0 findings in the DS trial
      '@eslint-react/no-children-map': 'error', // evaluated in #4: Children.* APIs are opaque and error-prone; use the children value directly; 0 findings in the DS trial
      '@eslint-react/no-children-only': 'error', // evaluated in #4: Children.* APIs are opaque and error-prone; use the children value directly; 0 findings in the DS trial
      '@eslint-react/no-children-to-array': 'error', // evaluated in #4: Children.* APIs are opaque and error-prone; use the children value directly; 0 findings in the DS trial
      '@eslint-react/no-class-component': 'off', // no counterpart; classes are already banned by base's no-restricted-syntax
      '@eslint-react/no-clone-element': 'error', // evaluated in #4: cloneElement hides data flow; pass props explicitly instead; 0 findings in the DS trial
      '@eslint-react/no-context-provider': 'error', // evaluated in #4: React 19 renders a context object directly instead of <Context.Provider>; 0 findings in the DS trial
      '@eslint-react/no-create-ref': 'error', // evaluated in #4: createRef is the class-component API; function components use useRef; 0 findings in the DS trial
      '@eslint-react/no-duplicate-key': 'error', // evaluated in #4 (jsx-key family): duplicate keys on siblings break reconciliation; eslint-plugin-react's jsx-key never checked this; 0 findings in the DS trial
      '@eslint-react/no-implicit-children': 'off', // evaluated in #4: requires type information — enabling it crashes lint runs without typed parsing, and no consumer runs typed linting today (TS files are ignored pending the typescript-eslint restoration); typed DS trial found 0 findings, so revisit at restoration (#8) when typed linting exists
      '@eslint-react/no-implicit-key': 'off', // evaluated in #4 (jsx-key family): requires type information — same typed-linting constraint as no-implicit-children; typed DS trial found 0 findings; revisit at restoration (#8)
      '@eslint-react/no-implicit-ref': 'off', // evaluated in #4: requires type information — same typed-linting constraint as no-implicit-children; typed DS trial found 0 findings; revisit at restoration (#8)
      '@eslint-react/no-misused-capture-owner-stack': 'error', // evaluated in #4: captureOwnerStack is dev-only and must follow React's usage contract; 0 findings in the DS trial
      '@eslint-react/no-nested-lazy-component-declarations': 'error', // evaluated in #4: lazy() wrappers declared in render are recreated every render; hoist them; 0 findings in the DS trial
      '@eslint-react/no-unnecessary-use-prefix': 'error', // evaluated in #4: a use-prefixed function must actually call a hook; 0 findings in the DS trial
      '@eslint-react/no-use-context': 'error', // evaluated in #4: React 19's use() replaces useContext; 0 findings in the DS trial
      '@eslint-react/purity': 'error', // evaluated in #4: components/hooks must not call impure functions or construct impure values during render; 0 findings in the DS trial
      '@eslint-react/refs': 'error', // evaluated in #4: ref.current must not be read or written during render; 0 findings in the DS trial
      '@eslint-react/rsc-function-definition': 'off', // no counterpart; no React Server Components in these apps
      '@eslint-react/set-state-in-effect': 'error', // evaluated in #4: no synchronous setState in an effect (extra renders); derive or subscribe instead; 0 findings in the DS trial
      '@eslint-react/set-state-in-render': 'error', // evaluated in #4: no unconditional setState during render (render loops); 0 findings in the DS trial
      '@eslint-react/static-components': 'error', // evaluated in #4: components must not be recreated every render; 0 findings in the DS trial
      '@eslint-react/unsupported-syntax': 'error', // evaluated in #4: no syntax React Compiler does not support; 0 findings in the DS trial
      '@eslint-react/use-memo': 'error', // evaluated in #4: useMemo results must be used and callbacks must be pure, parameterless value producers; 0 findings in the DS trial
      '@eslint-react/jsx-no-children-prop-with-children': 'error', // evaluated in #4: passing children both as a prop and as nested content is contradictory; 0 findings in the DS trial
      '@eslint-react/jsx-no-key-after-spread': 'error', // evaluated in #4: key after a spread deoptimizes the automatic JSX runtime; 0 findings in the DS trial
      '@eslint-react/jsx-no-leaked-dollar': 'error', // evaluated in #4: a leaked $ from a pasted template literal renders literally in JSX text; 0 findings in the DS trial
      '@eslint-react/jsx-no-leaked-semicolon': 'error', // evaluated in #4: a stray ; in JSX text renders literally; 0 findings in the DS trial
      '@eslint-react/dom-no-flush-sync': 'error', // evaluated in #4: flushSync forces synchronous layout outside React's scheduling; 0 findings in the DS trial
      '@eslint-react/dom-no-unsafe-iframe-sandbox': 'error', // evaluated in #4: iframe sandbox must not combine allow-scripts with allow-same-origin; 0 findings in the DS trial
      '@eslint-react/dom-no-use-form-state': 'error', // evaluated in #4: useFormState is superseded by React 19's useActionState; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-event-listener': 'error', // evaluated in #4: every addEventListener needs its removeEventListener cleanup; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-fetch': 'error', // evaluated in #4: every fetch in a component/hook needs an AbortController cleanup; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-intersection-observer': 'error', // evaluated in #4: every IntersectionObserver needs its disconnect() cleanup; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-interval': 'error', // evaluated in #4: every setInterval needs its clearInterval cleanup; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-resize-observer': 'error', // evaluated in #4: every ResizeObserver needs its disconnect() cleanup; 0 findings in the DS trial
      '@eslint-react/web-api-no-leaked-timeout': 'error', // evaluated in #4: every setTimeout needs its clearTimeout cleanup; 0 findings in the DS trial
      '@eslint-react/naming-convention-context-name': 'error', // evaluated in #4: createContext results are named <Name>Context; 0 findings in the DS trial
      '@eslint-react/naming-convention-id-name': 'error', // evaluated in #4: useId results are named id or *Id; 0 findings in the DS trial
      '@eslint-react/naming-convention-ref-name': 'error', // evaluated in #4: useRef results are named ref or *Ref; 0 findings in the DS trial
    },
  },
];

export default reactPending;
