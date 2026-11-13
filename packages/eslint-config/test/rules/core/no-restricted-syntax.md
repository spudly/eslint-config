# Rule: no-restricted-syntax

## Rule Description

Bans class declarations outright in this config: plain functions and objects are the house style.

## Configuration

```js
{
  // ...
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ClassDeclaration',
      message: 'Classes are not allowed. Use plain functions and objects instead.',
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
class Greeter {
  greet() {
    return 'hello';
  }
}
```

## Good

```js
export function greet() {
  return 'hello';
}
```
