# Rule: no-new-func

## Rule Description

Forbids building functions with the Function constructor, which is eval in disguise.

## Configuration

```js
{
  // ...
  'no-new-func': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const add = new Function('a', 'b', 'return a + b;');
```

## Good

```js
const add = (a, b) => a + b;
```
