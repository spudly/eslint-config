# Rule: prefer-template

## Rule Description

Prefers template literals over string concatenation for building text.

## Configuration

```js
{
  // ...
  'prefer-template': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = 'Hello, ' + name + '!';
```

## Good

```js
const label = `Hello, ${name}!`;
```
