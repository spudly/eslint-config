# Rule: @eslint-react/jsx-no-leaked-semicolon

## Rule Description

A stray semicolon at the start of JSX text renders literally in the output.

## Configuration

```js
{
  // ...
  '@eslint-react/jsx-no-leaked-semicolon': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
export function C() {
  return (
    <div>
      <p>hi</p>;
    </div>
  );
}
```

## Good

```js
export function C() {
  return <p>Hello</p>;
}
```
