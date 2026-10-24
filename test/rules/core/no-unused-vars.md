# Rule: no-unused-vars

## Rule Description

Forbids declared-but-never-read variables in plain JS files, where there is no type checker to catch the leftover.

## Configuration

```js
{
  // ...
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      caughtErrors: 'all',
      ignoreClassWithStaticInitBlock: false,
      ignoreUsingDeclarations: false,
      reportUsedIgnorePattern: false,
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
const unused = 1;
```

## Good

```js
export const used = 1;
```
