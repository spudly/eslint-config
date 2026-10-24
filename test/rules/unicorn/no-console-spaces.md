# Rule: unicorn/no-console-spaces

## Rule Description

Forbids leading or trailing spaces inside strings passed to console methods, where spacing belongs in separate arguments.

## Configuration

```js
{
  // ...
  'unicorn/no-console-spaces': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
console.log('ready ', 'now');
```

## Good

```js
console.log('ready', 'now');
```
