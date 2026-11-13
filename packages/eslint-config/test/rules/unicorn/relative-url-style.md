# Rule: unicorn/relative-url-style

## Rule Description

Forbids the redundant ./ prefix in relative URL strings passed to the URL constructor.

## Configuration

```js
{
  // ...
  'unicorn/relative-url-style': [
    'error',
    'never',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const asset = new URL('./image.png', base);
```

## Good

```js
const asset = new URL('image.png', base);
```
