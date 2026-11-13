# Rule: unicorn/no-unnecessary-slice-end

## Rule Description

Forbids passing the array length as the end argument of slice, which is the default behavior anyway.

## Configuration

```js
{
  // ...
  'unicorn/no-unnecessary-slice-end': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const rest = items.slice(1, items.length);
```

## Good

```js
const rest = items.slice(1);
```
