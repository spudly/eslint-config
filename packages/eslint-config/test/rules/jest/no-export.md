# Rule: jest/no-export

## Rule Description

Forbids export statements in test files; a test file exports nothing, and shared helpers belong in regular modules.

## Configuration

```js
{
  // ...
  'jest/no-export': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
export const helper = 1;
test('works', () => {
  expect(helper).toBe(1);
});
```

## Good

```js
const helper = 1;
test('works', () => {
  expect(helper).toBe(1);
});
```
