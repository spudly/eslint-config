# Rule: unicorn/no-magic-array-flat-depth

## Rule Description

Forbids passing a depth other than the default to Array#flat inline as a bare number, where the magic number hides how much flattening happens.

## Configuration

```js
{
  // ...
  'unicorn/no-magic-array-flat-depth': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const flat = nested.flat(2);
```

## Good

```js
const flat = nested.flat();
```
