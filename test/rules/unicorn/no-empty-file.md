# Rule: unicorn/no-empty-file

## Rule Description

Forbids files with no code in them, which are dead weight in the tree and usually an editing accident.

## Configuration

```js
{
  // ...
  'unicorn/no-empty-file': [
    'error',
    {allowComments: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
// Nothing here yet.
```

## Good

```js
export const ready = true;
```
