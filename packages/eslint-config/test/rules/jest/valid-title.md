# Rule: jest/valid-title

## Rule Description

Keeps test and describe titles well-formed: non-empty, without stray leading/trailing spaces or duplicated prefix words.

## Configuration

```js
{
  // ...
  'jest/valid-title': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test('works', () => {
  expect(true).toBe(true);
});
```
