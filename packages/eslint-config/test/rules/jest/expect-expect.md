# Rule: jest/expect-expect

## Rule Description

Requires every test to contain at least one expect, so a test that asserts nothing cannot pass by accident.

## Configuration

```js
{
  // ...
  'jest/expect-expect': 'warn',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('computes a total', () => {
  const total = 1 + 1;
  void total;
});
```

## Good

```js
test('computes a total', () => {
  expect(1 + 1).toBe(2);
});
```
