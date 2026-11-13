# Rule: no-new-native-nonconstructor

## Rule Description

Forbids calling native non-constructors like Symbol or BigInt with new, which throws a TypeError.

## Configuration

```js
{
  // ...
  'no-new-native-nonconstructor': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const id = new Symbol('id');
```

## Good

```js
const id = Symbol('id');
```
