# Rule: jest/valid-describe-callback

## Rule Description

Requires describe callbacks to be plain synchronous functions with a name and no parameters, so suite structure stays static.

## Configuration

```js
{
  // ...
  'jest/valid-describe-callback': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
describe('group', async () => {
  test('works', () => {
    expect(true).toBe(true);
  });
});
```

## Good

```js
describe('group', () => {
  test('works', () => {
    expect(true).toBe(true);
  });
});
```
