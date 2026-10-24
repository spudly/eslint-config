# Rule: jest/no-deprecated-functions

## Rule Description

Forbids Jest functions deprecated in the installed Jest version, like jest.genMockFromModule, which was renamed to jest.createMockFromModule.

## Configuration

```js
{
  // ...
  'jest/no-deprecated-functions': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('mocks the store', () => {
  const store = jest.genMockFromModule('./store');
  expect(store).toBeDefined();
});
```

## Good

```js
test('mocks the store', () => {
  const store = jest.createMockFromModule('./store');
  expect(store).toBeDefined();
});
```
