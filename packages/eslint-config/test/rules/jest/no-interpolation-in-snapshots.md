# Rule: jest/no-interpolation-in-snapshots

## Rule Description

Forbids interpolating values into snapshot template strings, which bakes run-dependent data into the snapshot and makes it churn.

## Configuration

```js
{
  // ...
  'jest/no-interpolation-in-snapshots': 'error',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.js

## Bad

```js
test('renders a label', () => {
  const label = renderLabel();
  expect(label).toMatchInlineSnapshot(`label is ${label}`);
});
```

## Good

```js
test('renders a label', () => {
  expect(renderLabel()).toMatchInlineSnapshot(`"ready"`);
});
```
