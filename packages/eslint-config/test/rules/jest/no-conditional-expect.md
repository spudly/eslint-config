# Rule: jest/no-conditional-expect

## Rule Description

Forbids expect calls inside conditionals, catch blocks, and callbacks, where they may silently never run.

## Configuration

```js
{
  // ...
  'jest/no-conditional-expect': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('sometimes asserts', () => {
  let value;
  try {
    value = compute();
  } catch {
    expect(value).toBeUndefined();
  }
});
```

## Good

```js
test('always asserts', () => {
  expect(compute()).toBe(1);
});
```
