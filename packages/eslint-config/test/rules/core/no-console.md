# Rule: no-console

## Rule Description

Forbids console.* in shipped code; logging goes through deliberate channels, not stray debug output.

## Configuration

```js
{
  // ...
  'no-console': [
    'error',
    {},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
console.log('ready');
```

## Good

```js
export const ready = true;
```
