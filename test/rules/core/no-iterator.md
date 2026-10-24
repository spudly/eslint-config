# Rule: no-iterator

## Rule Description

Forbids the legacy **iterator** property; use the Symbol.iterator protocol instead.

## Configuration

```js
{
  // ...
  'no-iterator': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const iterator = collection.__iterator__;
```

## Good

```js
const iterator = collection[Symbol.iterator]();
```
