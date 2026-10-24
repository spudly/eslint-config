# Rule: @eslint-react/no-missing-context-display-name

## Rule Description

Requires objects created with createContext to be given a displayName, so context shows up named in DevTools instead of as an anonymous Context.

## Configuration

```js
{
  // ...
  '@eslint-react/no-missing-context-display-name': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
const ThemeContext = createContext('light');
export const theme = ThemeContext;
```

## Good

```js
const ThemeContext = createContext('light');
ThemeContext.displayName = 'ThemeContext';
export const theme = ThemeContext;
```
