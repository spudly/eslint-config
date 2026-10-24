# Rule: unicorn/no-useless-spread

## Rule Description

Forbids spreading a value into the same kind of container it already is, like `[...[...items]]`, which copies for no reason.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const copy = [...[...items]];
```

## Good

```js
const copy = [...items];
```
