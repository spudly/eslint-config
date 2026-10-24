# Rule: jest/no-identical-title

## Rule Description

Forbids two tests (or two describes) with the same title in one scope, which makes failure output ambiguous.

## Configuration

```js
{
  // ...
  'jest/no-identical-title': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
describe('group', () => {
  test('works', () => {
    expect(true).toBe(true);
  });
  test('works', () => {
    expect(false).toBe(false);
  });
});
```

## Good

```js
describe('group', () => {
  test('works', () => {
    expect(true).toBe(true);
  });
  test('also works', () => {
    expect(false).toBe(false);
  });
});
```
