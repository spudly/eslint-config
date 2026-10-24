# Rule: jest/valid-expect

## Rule Description

Requires expect to be called with exactly one argument and followed by a matcher call.

## Configuration

```js
{
  // ...
  'jest/valid-expect': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('incomplete', () => {
  expect(42);
});
```

## Good

```js
test('complete', () => {
  expect(42).toBe(42);
});
```
