# Rule: no-new-wrappers

## Rule Description

Forbids new String/Number/Boolean, which create wrapper objects that compare and behave differently from primitives.

## Configuration

```js
{
  // ...
  'no-new-wrappers': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = new String('ready');
```

## Good

```js
const label = 'ready';
```
