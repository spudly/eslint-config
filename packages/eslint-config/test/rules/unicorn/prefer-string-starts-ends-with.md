# Rule: unicorn/prefer-string-starts-ends-with

## Rule Description

Prefers startsWith/endsWith over testing a string against an anchored regular expression like /^test/ or /test$/, which states the same check less directly.

## Configuration

```js
{
  // ...
  'unicorn/prefer-string-starts-ends-with': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const isTest = /^test/.test(name);
```

## Good

```js
const isTest = name.startsWith('test');
```
