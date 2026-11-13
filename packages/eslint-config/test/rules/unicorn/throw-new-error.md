# Rule: unicorn/throw-new-error

## Rule Description

Requires `new` when throwing an Error, matching the constructor form used everywhere else.

## Configuration

```js
{
  // ...
  'unicorn/throw-new-error': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
throw Error('boom');
```

## Good

```js
throw new Error('boom');
```
