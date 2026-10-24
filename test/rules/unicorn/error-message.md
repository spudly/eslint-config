# Rule: unicorn/error-message

## Rule Description

Requires every Error to be constructed with a message, so failures are diagnosable when they surface.

## Configuration

```js
{
  // ...
  'unicorn/error-message': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
throw new Error();
```

## Good

```js
throw new Error('something failed');
```
