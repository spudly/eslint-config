module.exports = {
  plugins: [
    'react',
  ],
  rules: {
    'react/display-name': ['warn', {ignoreTranspilerName: true}],
    'react/forbid-prop-types': ['error', {forbid: ['any', 'array', 'object']}],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-curly-spacing': ['error', 'never', {allowMultiline: true}],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-filename-extension': ['warn', {extensions: ['.js']}],
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: '_handle',
      eventHandlerPropPrefix: 'on',
    }],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-key': 'error',
    'react/jsx-max-props-per-line': 'off', // max-len is enough for me
    'react/jsx-no-bind': ['error', {ignoreRefs: true}],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': ['error', {ignoreCase: false}],
    'react/jsx-no-literals': 'off', // I dont like this rule.
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': ['warn', {ignoreCase: true}],
    'react/jsx-space-before-closing': [2, 'always'],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-wrap-multilines': 'warn',
    'react/no-comment-textnodes': 'off', // deprecated
    'react/no-danger': 'warn',
    'react/no-deprecated': 'error',
    'react/no-did-mount-set-state': 'off', // need setState in componentDidMount for client-side-only logic
    'react/no-did-update-set-state': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-multi-comp': ['warn', {ignoreStateless: true}],
    'react/no-render-return-value': 'error',
    'react/no-set-state': 'off', // setState is not bad.
    'react/no-string-refs': 'error',
    'react/no-unknown-property': 'error',
    'react/prefer-es6-class': ['error', 'always'],
    'react/prefer-stateless-function': 'error',
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/require-extension': 'off', // deprecated
    'react/wrap-multilines': 'off', // deprecated
    'react/require-optimization': 'off', // optimization should be as-needed
    'react/require-render-return': 'error',
    'react/self-closing-comp': 'warn',
    'react/sort-comp': 'warn',
    'react/sort-prop-types': ['warn', {ignoreCase: true}],
  },
};
