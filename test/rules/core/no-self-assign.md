# Rule: no-self-assign

## Rule Description

Forbids assigning a variable or property to itself, which is either dead code or a typo.

## Configuration

```js
{
  // ...
  'no-self-assign': [
    'error',
    {props: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
let count = 1;
count = count;
```

## Good

```js
let count = 1;
count = other;
```
