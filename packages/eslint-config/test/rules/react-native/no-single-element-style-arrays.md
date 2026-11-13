# Rule: react-native/no-single-element-style-arrays

## Rule Description

Forbids wrapping a single style object in an array, which allocates for nothing; pass the object directly.

## Configuration

```js
{
  // ...
  'react-native/no-single-element-style-arrays': 'error',
  // ...
}
```

## Test setup

- Export: reactNative
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <View style={[styles.container]} />;
}
```

## Good

```js
export function Box() {
  return <View style={styles.container} />;
}
```
