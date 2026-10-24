# Rule: jest/no-test-prefixes

## Rule Description

Forbids the x/f test prefixes (xit, ftest, xdescribe, ...); write test/describe with .skip or .only, which say what they mean.

## Configuration

```js
{
  // ...
  'jest/no-test-prefixes': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
xit('not ready yet', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test.skip('not ready yet', () => {
  expect(true).toBe(true);
});
```
