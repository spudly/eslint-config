# Rule: jest/valid-expect-in-promise

## Rule Description

Requires promise chains containing expectations to be returned or awaited, so the assertions finish before the test does.

## Configuration

```js
{
  // ...
  'jest/valid-expect-in-promise': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('loads a value', () => {
  loadValue().then(value => {
    expect(value).toBe(1);
  });
});
```

## Good

```js
test('loads a value', () => {
  return loadValue().then(value => {
    expect(value).toBe(1);
  });
});
```
