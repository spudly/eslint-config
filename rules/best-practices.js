module.exports = {
  rules: {
    'accessor-pairs': 'warn',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    complexity: ['warn', 11],
    'consistent-return': 'warn',
    curly: ['warn', 'multi-line'],
    'default-case': ['warn', {commentPattern: '^no default$'}],
    'dot-location': ['error', 'property'],
    'dot-notation': ['error', {allowKeywords: true}],
    eqeqeq: ['error', 'allow-null'],
    'guard-for-in': 'error',
    'no-alert': 'warn',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': ['error', {boolean: false}],
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': ['error', {allowLoop: false, allowSwitch: false}],
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': 'off', // magic numbers are not necessarily bad. we use them in THIS FILE!
    'no-multi-spaces': 'warn',
    'no-multi-str': 'error',
    'no-native-reassign': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-new': 'error',
    'no-octal-escape': 'error',
    'no-octal': 'error',
    'no-param-reassign': ['error', {props: true}],
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'warn',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-void': 'error',
    'no-warning-comments': ['warn', {terms: ['todo'], location: 'start'}],
    'no-with': 'error',
    radix: 'error',
    'vars-on-top': 'error',
    'wrap-iife': ['error', 'outside'],
    yoda: 'error',
  },
};
