# Rule: jest/no-standalone-expect

## Rule Description

Requires expect calls to live inside a test (or a hook/helper called from one), not dangling at suite or module level where Jest never runs them as assertions.

## Configuration

```js
{
  // ...
  'jest/no-standalone-expect': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
expect(computeTotal()).toBe(3);
test('works', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test('works', () => {
  expect(computeTotal()).toBe(3);
  expect(true).toBe(true);
});
```
