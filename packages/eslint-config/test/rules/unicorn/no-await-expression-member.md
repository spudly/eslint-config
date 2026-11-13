# Rule: unicorn/no-await-expression-member

## Rule Description

Forbids accessing a property directly on an await expression, where the precedence is easy to misread; bind the awaited value first.

## Configuration

```js
{
  // ...
  'unicorn/no-await-expression-member': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const name = (await loadUser()).name;
```

## Good

```js
const user = await loadUser();
const name = user.name;
```
