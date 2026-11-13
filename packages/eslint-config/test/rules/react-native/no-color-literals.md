# Rule: react-native/no-color-literals

## Rule Description

Forbids raw color literals in React Native stylesheets; colors come from the theme so light and dark stay coherent.

## Configuration

```js
{
  // ...
  'react-native/no-color-literals': 'error',
  // ...
}
```

## Test setup

- Export: reactNative
- File: fixture.tsx

## Bad

```js
const styles = StyleSheet.create({
  container: {backgroundColor: '#fff'},
});
```

## Good

```js
const styles = StyleSheet.create({
  container: {flex: 1},
});
```
