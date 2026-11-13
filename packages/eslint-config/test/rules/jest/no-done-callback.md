# Rule: jest/no-done-callback

## Rule Description

Forbids the done callback style; async tests return a promise (or use async/await) so Jest can observe failures.

## Configuration

```js
{
  // ...
  'jest/no-done-callback': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('legacy async', done => {
  setTimeout(() => {
    expect(true).toBe(true);
    done();
  }, 10);
});
```

## Good

```js
test('modern async', async () => {
  await Promise.resolve();
  expect(true).toBe(true);
});
```
