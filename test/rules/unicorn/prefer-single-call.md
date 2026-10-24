# Rule: unicorn/prefer-single-call

## Rule Description

Forbids consecutive push calls on the same array, which a single push with several arguments says at once.

## Configuration

```js
{
  // ...
  'unicorn/prefer-single-call': [
    'error',
    {ignore: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
list.push('a');
list.push('b');
```

## Good

```js
list.push('a', 'b');
```
