# Rule: no-extend-native

## Rule Description

Forbids adding or changing properties on native prototypes, which changes behavior for every other piece of code.

## Configuration

```js
{
  // ...
  'no-extend-native': [
    'error',
    {exceptions: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
String.prototype.shout = function () {
  return this.toUpperCase();
};
```

## Good

```js
export function shout(text) {
  return text.toUpperCase();
}
```
