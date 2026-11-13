# Rule: jest/no-alias-methods

## Rule Description

Forbids the old matcher aliases (toBeCalled and friends) in favor of the canonical matcher names.

## Configuration

```js
{
  // ...
  'jest/no-alias-methods': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('calls the spy', () => {
  const spy = jest.fn();
  spy();
  expect(spy).toBeCalled();
});
```

## Good

```js
test('calls the spy', () => {
  const spy = jest.fn();
  spy();
  expect(spy).toHaveBeenCalled();
});
```
