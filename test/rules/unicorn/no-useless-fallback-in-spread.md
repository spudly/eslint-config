# Rule: unicorn/no-useless-fallback-in-spread

## Rule Description

Forbids spreading a nullish fallback object like `...(value ?? {})`, since spreading null or undefined is already a no-op.

## Configuration

```js
{
  // ...
  'unicorn/no-useless-fallback-in-spread': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const merged = {...(settings ?? {})};
```

## Good

```js
const merged = {...settings};
```
