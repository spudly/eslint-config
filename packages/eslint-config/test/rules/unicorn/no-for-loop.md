# Rule: unicorn/no-for-loop

## Rule Description

Forbids index-based for loops that just walk an array, in favor of for...of.

## Configuration

```js
{
  // ...
  'unicorn/no-for-loop': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
for (let index = 0; index < items.length; index++) {
  save(items[index]);
}
```

## Good

```js
for (const item of items) {
  save(item);
}
```
