/* eslint-disable max-lines */
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 7,
    sourceType: "module"
  },
  plugins: ["import", "jsx-a11y", "react", "lodash-fp"],
  rules: {
    "accessor-pairs": "warn",
    "array-bracket-spacing": ["warn", "never"],
    "array-callback-return": "error",
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": "off", // I prefer leaving the parens off when I can
    "arrow-spacing": "warn",
    "block-scoped-var": "error",
    "block-spacing": ["warn", "always"],
    "brace-style": ["warn", "1tbs", { allowSingleLine: true }],
    "callback-return": "off", // conflicts with no-useless-return
    camelcase: ["warn", { properties: "never" }],
    "capitalized-comments": "off", // terrible idea to enforce case on comments!
    "class-methods-use-this": "warn",
    "comma-dangle": "off", // handled by prettier
    "comma-spacing": ["warn", { after: true, before: false }],
    "comma-style": ["warn", "last"],
    complexity: ["warn", 11],
    "computed-property-spacing": ["warn", "never"],
    "consistent-return": "warn",
    "consistent-this": ["warn", "self"],
    "constructor-super": "error",
    curly: ["warn", "multi-line"],
    "default-case": ["warn", { commentPattern: "^no default$" }],
    "dot-location": ["error", "property"],
    "dot-notation": ["error", { allowKeywords: true }],
    "eol-last": "warn",
    eqeqeq: ["error", "allow-null"],
    "func-call-spacing": "off", // deprecated
    "func-name-matching": "warn",
    "func-names": "off", // forces writing the name twice. annoying!
    "func-style": "warn",
    "generator-star-spacing": ["warn", { after: true, before: false }],
    "global-require": "error",
    "guard-for-in": "error",
    "handle-callback-err": "error",
    "id-blacklist": ["warn", "data"],
    "id-length": ["warn", { max: 50, min: 1 }],
    "id-match": "off", // 'off' because I dont have any use for it
    "import/default": "error",
    "import/export": "error",
    "import/extensions": "off", // too strict. I prefer never, but with exceptions (.json)
    "import/first": "warn",
    "import/imports-first": "off", // deprecated
    "import/max-dependencies": "warn",
    "import/named": "error",
    "import/namespace": ["error", { allowComputed: true }],
    "import/newline-after-import": "error",
    "import/no-absolute-path": "error",
    "import/no-amd": "error",
    "import/no-commonjs": "off", // sometimes we need commonjs :(
    "import/no-deprecated": "off", // jsdoc is bad. code says what. comments say why!
    "import/no-duplicates": "error",
    "import/no-dynamic-require": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-internal-modules": "off", // needed for lodash and ramda
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "error",
    "import/no-named-as-default-member": "error",
    "import/no-named-default": "error",
    "import/no-namespace": "off", // no reason to disallow namespace imports
    "import/no-nodejs-modules": "off", // core modules are not a bad thing
    "import/no-restricted-paths": "off", // no paths to restrict
    "import/no-unassigned-import": "warn",
    "import/no-unresolved": ["error", { commonjs: true }],
    "import/no-webpack-loader-syntax": "warn",
    "import/order": "off", // conflicts with 'sort-imports' rule
    "import/prefer-default-export": "error",
    "import/unambiguous": "error",
    indent: ["warn", 2, { SwitchCase: 1 }],
    "init-declarations": "off",
    "jsx-a11y/accessible-emoji": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/href-no-hash": "warn",
    "jsx-a11y/html-has-lang": "warn",
    "jsx-a11y/iframe-has-title": "warn",
    "jsx-a11y/img-has-alt": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/label-has-for": "warn",
    "jsx-a11y/lang": "warn",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "warn",
    "jsx-a11y/no-onchange": "warn",
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/onclick-has-focus": "warn",
    "jsx-a11y/onclick-has-role": "warn",
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "warn",
    "jsx-a11y/tabindex-no-positive": "warn",
    "jsx-quotes": ["warn", "prefer-double"],
    "key-spacing": ["warn", { afterColon: true, beforeColon: false }],
    "keyword-spacing": "warn",
    "line-comment-position": "off", // comments should go where they fit.
    "linebreak-style": ["warn", "unix"],
    "lines-around-comment": "off", // 'off' because: why would anyone want that?
    "lines-around-directive": ["warn", { after: "always", before: "never" }],
    "lodash-fp/consistent-compose": "warn",
    "lodash-fp/consistent-name": ["error", "_"],
    "lodash-fp/no-argumentless-calls": "error",
    "lodash-fp/no-chain": "error",
    "lodash-fp/no-extraneous-args": "error",
    "lodash-fp/no-extraneous-function-wrapping": "error",
    "lodash-fp/no-extraneous-iteratee-args": "error",
    "lodash-fp/no-for-each": ["warn", { noNative: false }],
    "lodash-fp/no-partial-of-curried": "error",
    "lodash-fp/no-single-composition": "error",
    "lodash-fp/no-submodule-destructuring": "error",
    "lodash-fp/no-unused-result": "error",
    "lodash-fp/prefer-compact": "error",
    "lodash-fp/prefer-composition-grouping": "error",
    "lodash-fp/prefer-constant": "off", // makes code harder to read
    "lodash-fp/prefer-flat-map": "error",
    "lodash-fp/prefer-get": "error",
    "lodash-fp/prefer-identity": ["error", { arrowFunctions: false }],
    "lodash-fp/preferred-alias": "warn",
    "lodash-fp/use-fp": "error",
    "max-depth": ["warn", 4],
    "max-len": [
      "warn",
      { code: 100, ignoreTrailingComments: true, tabWidth: 2 }
    ],
    "max-lines": [
      "warn",
      { max: 200, skipBlankLines: false, skipComments: false }
    ],
    "max-nested-callbacks": ["warn", 2],
    "max-params": ["warn", 5],
    "max-statements": ["warn", 10],
    "max-statements-per-line": ["warn", { max: 1 }],
    "multiline-ternary": "off", // 'off' because some should be multiline, others single
    "new-cap": ["warn", { newIsCap: true }],
    "new-parens": "warn",
    "newline-after-var": "off", // dont want to enforce one way or the other
    "newline-before-return": "off", // dont want to enforce one way or the other
    "newline-per-chained-call": ["warn", { ignoreChainWithDepth: 4 }],
    "no-alert": "warn",
    "no-array-constructor": "warn",
    "no-await-in-loop": "off", // i await in loops intentionally sometimes
    "no-bitwise": "error",
    "no-caller": "error",
    "no-case-declarations": "error",
    "no-catch-shadow": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": ["error", "always"],
    "no-confusing-arrow": ["error", { allowParens: true }],
    "no-console": "warn",
    "no-const-assign": "error",
    "no-constant-condition": "warn",
    "no-continue": "warn",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-div-regex": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty": "error",
    "no-empty-character-class": "error",
    "no-empty-function": "error",
    "no-empty-pattern": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-ex-assign": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-label": "error",
    "no-extra-parens": ["warn", "all"],
    "no-extra-semi": "error",
    "no-fallthrough": "error",
    "no-floating-decimal": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-implicit-coercion": ["error", { boolean: false }],
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-inline-comments": "off", // inline comments are not inherently bad
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-invalid-this": "error",
    "no-irregular-whitespace": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
    "no-lone-blocks": "error",
    "no-lonely-if": "warn",
    "no-loop-func": "error",
    "no-magic-numbers": "off", // magic numbers are not necessarily bad. we use them in THIS FILE!
    "no-mixed-operators": "warn",
    "no-mixed-requires": "error",
    "no-mixed-spaces-and-tabs": "warn",
    "no-multi-assign": "off", // i like multi-assign syntax :p
    "no-multi-spaces": "warn",
    "no-multi-str": "error",
    "no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 1 }],
    "no-native-reassign": "off", // deprecated
    "no-negated-condition": "warn",
    "no-negated-in-lhs": "off", // deprecated
    "no-nested-ternary": "warn",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "warn",
    "no-new-require": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-param-reassign": ["error", { props: true }],
    "no-path-concat": "error",
    "no-plusplus": "off", // ++ is not bad.
    "no-process-env": "off", // off because process.env helps optimize builds
    "no-process-exit": "error",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-restricted-globals": ["error", "$", "_"],
    "no-restricted-imports": "off", // dont want to restrict imports
    "no-restricted-modules": "off", // dont want to restrict modules
    "no-restricted-properties": "off", // couldnt think of any properties to restrict...
    "no-restricted-syntax": "off", // other rules take care of these
    "no-return-assign": "error",
    "no-return-await": "warn",
    "no-script-url": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-spaced-func": "warn",
    "no-sparse-arrays": "error",
    "no-sync": "warn",
    "no-tabs": "warn",
    "no-template-curly-in-string": "error",
    "no-ternary": "off", // ternary statements are not bad.
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "warn",
    "no-undef": "error",
    "no-undef-init": "off", // clashes with init-declarations
    "no-undefined": "error",
    "no-underscore-dangle": "off", // dangling underscores convey useful information
    "no-unexpected-multiline": "warn",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": ["warn", { defaultAssignment: false }],
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-unused-vars": "error",
    "no-use-before-define": ["error", "nofunc"],
    "no-useless-call": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": "warn",
    "no-useless-return": "warn",
    "no-var": "error",
    "no-void": "error",
    "no-warning-comments": ["warn", { location: "start", terms: ["todo"] }],
    "no-whitespace-before-property": "warn",
    "no-with": "error",
    "nonblock-statement-body-position": "off", // controlled by prettier
    "object-curly-newline": "off", // too inflexible to meet my needs
    "object-curly-spacing": ["warn", "never"],
    "object-property-newline": [
      "warn",
      { allowMultiplePropertiesPerLine: true }
    ],
    "object-shorthand": "warn",
    "one-var": ["warn", "never"],
    "one-var-declaration-per-line": ["warn", "always"],
    "operator-assignment": ["warn", "always"],
    "operator-linebreak": "off", // this rule would enforce ugly code
    "padded-blocks": ["warn", "never"],
    "prefer-arrow-callback": "warn",
    "prefer-const": ["warn", { ignoreReadBeforeAssign: true }],
    "prefer-destructuring": "warn",
    "prefer-numeric-literals": ["warn"],
    "prefer-promise-reject-errors": "warn",
    "prefer-reflect": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",
    "prefer-template": "warn",
    "quote-props": ["warn", "as-needed"],
    quotes: ["warn", "single", { avoidEscape: true }],
    radix: ["error"],
    "react/display-name": ["warn", { ignoreTranspilerName: true }],
    "react/forbid-component-props": "off", // dont want to forbid className or style attributes
    "react/forbid-elements": "off", // nothing to forbid?
    "react/forbid-foreign-prop-types": "error",
    "react/forbid-prop-types": [
      "error",
      { forbid: ["any", "array", "object"] }
    ],
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-closing-bracket-location": ["error", "line-aligned"],
    "react/jsx-curly-spacing": ["error", "never", { allowMultiline: true }],
    "react/jsx-equals-spacing": ["error", "never"],
    "react/jsx-filename-extension": ["warn", { extensions: [".js"] }],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/jsx-handler-names": [
      "error",
      { eventHandlerPrefix: "_handle", eventHandlerPropPrefix: "on" }
    ],
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-key": "error",
    "react/jsx-max-props-per-line": "off", // max-len is enough for me
    "react/jsx-no-bind": ["error", { ignoreRefs: true }],
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": ["error", { ignoreCase: false }],
    "react/jsx-no-literals": "off", // I dont like this rule.
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": "error",
    "react/jsx-sort-props": ["off"], // no. just no.
    "react/jsx-space-before-closing": [2, "always"],
    "react/jsx-tag-spacing": "warn",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-wrap-multilines": [
      "error",
      {
        assignment: false,
        declaration: false,
        return: true
      }
    ],
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "error",
    "react/no-comment-textnodes": "off", // deprecated
    "react/no-danger": "warn",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-did-mount-set-state": "off", // need setState in componentDidMount for client-side-only logic
    "react/no-did-update-set-state": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-multi-comp": ["warn", { ignoreStateless: true }],
    "react/no-render-return-value": "error",
    "react/no-set-state": "off", // setState is not bad.
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "error",
    "react/no-unused-prop-types": "warn",
    "react/prefer-es6-class": ["error", "always"],
    "react/prefer-stateless-function": "error",
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-default-props": "warn",
    "react/require-extension": "off", // deprecated
    "react/require-optimization": "off", // optimization should be as-needed
    "react/require-render-return": "error",
    "react/self-closing-comp": "warn",
    "react/sort-comp": [
      "warn",
      {
        groups: {
          lifecycle: [
            "displayName",
            "propTypes",
            "contextTypes",
            "childContextTypes",
            "statics",
            "defaultProps",
            "constructor",
            "getDefaultProps",
            "getInitialState",
            "state",
            "getChildContext",
            "componentWillMount",
            "componentDidMount",
            "componentWillReceiveProps",
            "shouldComponentUpdate",
            "componentWillUpdate",
            "componentDidUpdate",
            "componentWillUnmount"
          ]
        },
        order: [
          "static-methods",
          "lifecycle",
          "render",
          "^_render.+/",
          "everything-else",
          "/^_handle.+/"
        ]
      }
    ],
    "react/sort-prop-types": ["warn", { ignoreCase: true }],
    "react/style-prop-object": "error",
    "react/void-dom-elements-no-children": "off", // buggy. see yannickcr/eslint-plugin-react#1073
    "react/wrap-multilines": "off", // deprecated
    "require-await": "warn",
    "require-jsdoc": "off", // jsdoc is dumb. comments should say why, not what.
    "require-yield": "error",
    "rest-spread-spacing": ["warn", "never"],
    semi: ["warn", "always"],
    "semi-spacing": ["warn", { after: true, before: false }],
    "sort-imports": "off", // this is too annoying to be enabled
    "sort-keys": "off", // gets annoying after a while
    "sort-vars": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", "never"],
    "space-in-parens": ["warn", "never"],
    "space-infix-ops": "warn",
    "space-unary-ops": "warn",
    "spaced-comment": ["warn", "always"],
    strict: ["error", "never"],
    "symbol-description": ["warn"],
    "template-curly-spacing": "warn",
    "template-tag-spacing": ["warn", "never"],
    "unicode-bom": ["warn", "never"],
    "use-isnan": "error",
    "valid-jsdoc": "off", // 'off' because jsdoc is bad. comments say why, not what!
    "valid-typeof": "error",
    "vars-on-top": "error",
    "wrap-iife": ["error", "outside"],
    "wrap-regex": "off", // wrapping regexes in parens is unnecessary
    "yield-star-spacing": ["warn", "after"],
    yoda: ["error"]
  }
};
