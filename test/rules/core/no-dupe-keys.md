# Rule: no-dupe-keys

## Rule Description

Forbids duplicate keys in an object literal, where the second value silently overwrites the first.

## Configuration

```js
{
  // ...
  'no-dupe-keys': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const options = {mode: 'fast', mode: 'slow'};
```

## Good

```js
const options = {mode: 'fast', level: 'slow'};
```
