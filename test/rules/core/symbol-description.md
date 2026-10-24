# Rule: symbol-description

## Rule Description

Requires a description for Symbol(), which is the only debugging handle a symbol has.

## Configuration

```js
{
  // ...
  'symbol-description': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const id = Symbol();
```

## Good

```js
const id = Symbol('id');
```
