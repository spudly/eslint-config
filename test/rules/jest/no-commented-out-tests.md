# Rule: jest/no-commented-out-tests

## Rule Description

Forbids leaving tests commented out in a suite file; a test is either live or deleted.

## Configuration

```js
{
  // ...
  'jest/no-commented-out-tests': 'warn',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
// test('legacy behaviour', () => {
//   expect(true).toBe(true);
// });
test('current behaviour', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test('current behaviour', () => {
  expect(true).toBe(true);
});
```
