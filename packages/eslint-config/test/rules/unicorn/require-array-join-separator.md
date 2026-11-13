# Rule: unicorn/require-array-join-separator

## Rule Description

Requires an explicit separator argument for Array#join, whose default comma is rarely what output should use.

## Configuration

```js
{
  // ...
  'unicorn/require-array-join-separator': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const label = parts.join();
```

## Good

```js
const label = parts.join(', ');
```
