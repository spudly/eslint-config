# Rule: no-eval

## Rule Description

Forbids eval, which executes arbitrary strings as code and defeats static analysis.

## Configuration

```js
{
  // ...
  'no-eval': [
    'error',
    {allowIndirect: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const result = eval('1 + 1');
```

## Good

```js
const result = 1 + 1;
```
