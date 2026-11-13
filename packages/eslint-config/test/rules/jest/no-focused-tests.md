# Rule: jest/no-focused-tests

## Rule Description

Forbids focused tests (.only, fdescribe, fit), which silently skip the rest of the suite.

## Configuration

```js
{
  // ...
  'jest/no-focused-tests': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test.only('focused', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test('focused', () => {
  expect(true).toBe(true);
});
```
