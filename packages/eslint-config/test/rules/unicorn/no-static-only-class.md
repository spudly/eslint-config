# Rule: unicorn/no-static-only-class

## Rule Description

Forbids classes that contain only static members; a plain object or standalone functions say the same thing without a fake type.

## Configuration

```js
{
  // ...
  'unicorn/no-static-only-class': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
class Formatter {
  static shout(text) {
    return text.toUpperCase();
  }
}
```

## Good

```js
export function shout(text) {
  return text.toUpperCase();
}
```
