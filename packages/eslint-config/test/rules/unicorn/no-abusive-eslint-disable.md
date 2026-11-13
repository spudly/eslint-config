# Rule: unicorn/no-abusive-eslint-disable

## Rule Description

Forbids bare eslint-disable comments that switch off every rule; a disable must name the rules it suppresses.

## Configuration

```js
{
  // ...
  'unicorn/no-abusive-eslint-disable': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
/* eslint-disable */
console.log('ready');
```

## Good

```js
// eslint-disable-next-line no-console -- deliberate demo output
console.log('ready');
```
