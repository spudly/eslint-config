# Rule: no-array-constructor

## Rule Description

Forbids the Array constructor in favor of array literals, except the single-length-argument form.

## Configuration

```js
{
  // ...
  'no-array-constructor': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const values = new Array(1, 2, 3);
```

## Good

```js
const values = [1, 2, 3];
```
