# Rule: react-native/no-inline-styles

## Rule Description

Forbids inline style objects in JSX, which recreate the style object every render and escape the stylesheet; styles live in StyleSheet.create.

## Configuration

```js
{
  // ...
  'react-native/no-inline-styles': 'error',
  // ...
}
```

## Test setup

- Export: reactNative
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <View style={{flex: 1}} />;
}
```

## Good

```js
export function Box() {
  const styles = StyleSheet.create({container: {flex: 1}});
  return <View style={styles.container} />;
}
```
