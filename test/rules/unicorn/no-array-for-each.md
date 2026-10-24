# Rule: unicorn/no-array-for-each

## Rule Description

Forbids Array#forEach in favor of for...of, which supports break/continue/await and reads as plain control flow.

## Configuration

```js
{
  // ...
  'unicorn/no-array-for-each': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
items.forEach(item => {
  save(item);
});
```

## Good

```js
for (const item of items) {
  save(item);
}
```
