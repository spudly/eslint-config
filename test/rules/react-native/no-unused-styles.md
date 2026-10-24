# Rule: react-native/no-unused-styles

## Rule Description

Forbids styles defined in a stylesheet that no component references, which are leftovers from deleted UI.

## Configuration

```js
{
  // ...
  'react-native/no-unused-styles': 'error',
  // ...
}
```

## Test setup

- Export: reactNative
- File: fixture.tsx

## Bad

```js
const styles = StyleSheet.create({
  container: {flex: 1},
  unused: {flex: 2},
});
export function Box() {
  return <View style={styles.container} />;
}
```

## Good

```js
const styles = StyleSheet.create({
  container: {flex: 1},
});
export function Box() {
  return <View style={styles.container} />;
}
```
