# Rule: jest/no-jasmine-globals

## Rule Description

Forbids Jasmine globals and helpers (jasmine.createSpy, spyOn, fail, ...), which Jest only shims for compatibility; use the jest equivalents.

## Configuration

```js
{
  // ...
  'jest/no-jasmine-globals': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('spies on the loader', () => {
  const spy = jasmine.createSpy('load');
  spy();
  expect(spy).toHaveBeenCalled();
});
```

## Good

```js
test('spies on the loader', () => {
  const spy = jest.fn();
  spy();
  expect(spy).toHaveBeenCalled();
});
```
