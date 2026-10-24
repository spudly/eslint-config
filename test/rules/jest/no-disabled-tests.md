# Rule: jest/no-disabled-tests

## Rule Description

Warns on skipped or pending tests (test.skip, xit, empty bodies), so disabled coverage stays visible instead of rotting quietly.

## Configuration

```js
{
  // ...
  'jest/no-disabled-tests': 'warn',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test.skip('not ready yet', () => {
  expect(true).toBe(true);
});
```

## Good

```js
test('ready', () => {
  expect(true).toBe(true);
});
```
