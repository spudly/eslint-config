# Rule: jest/no-mocks-import

## Rule Description

Forbids importing from a **mocks** directory directly; Jest wires manual mocks in through jest.mock.

## Configuration

```js
{
  // ...
  'jest/no-mocks-import': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
import {double} from '../__mocks__/math';
test('doubles', () => {
  expect(double(2)).toBe(4);
});
```

## Good

```js
import {double} from '../math';
test('doubles', () => {
  expect(double(2)).toBe(4);
});
```
