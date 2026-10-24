# Rule: react-native/no-raw-text

## Rule Description

Requires raw text in React Native to be wrapped in a <Text> component, since bare strings crash the native renderer.

## Configuration

```js
{
  // ...
  'react-native/no-raw-text': 'error',
  // ...
}
```

## Test setup

- Export: reactNative
- File: fixture.tsx

## Bad

```js
export function Label() {
  return <View>Hello</View>;
}
```

## Good

```js
export function Label() {
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
```
