# Rule: unicorn/prefer-module

## Rule Description

Requires ES modules over CommonJS require/module.exports in files that are not CommonJS-scoped.

## Configuration

```js
{
  // ...
  'unicorn/prefer-module': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule only reports the CommonJS globals (require, module, exports, __dirname, __filename) when the lint configuration declares them as globals — an identifier that is merely unresolved is, by the rule's own check, not a global reference. The base export declares no such globals, so under the composed base config no snippet can make the rule fire. It does fire in Node-scoped consumer configs, which declare those globals.
