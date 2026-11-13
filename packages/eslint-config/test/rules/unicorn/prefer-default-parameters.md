# Rule: unicorn/prefer-default-parameters

## Rule Description

Prefers parameter defaults over reassigning a parameter with a nullish fallback at the top of the function.

## Configuration

```js
{
  // ...
  'unicorn/prefer-default-parameters': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
function greet(name) {
  name = name ?? 'friend';
  return 'Hello, ' + name;
}
```

## Good

```js
function greet(name = 'friend') {
  return 'Hello, ' + name;
}
```
