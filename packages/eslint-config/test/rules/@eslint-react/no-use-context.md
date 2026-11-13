# Rule: @eslint-react/no-use-context

## Rule Description

React 19's use() replaces useContext for reading context in a component.

## Configuration

```js
{
  // ...
  '@eslint-react/no-use-context': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {createContext, useContext} from 'react';

const ThemeContext = createContext('light');

export function C() {
  const theme = useContext(ThemeContext);
  return <p>{theme}</p>;
}
```

## Good

```js
import {createContext, use} from 'react';

const ThemeContext = createContext('light');

export function C() {
  const theme = use(ThemeContext);
  return <p>{theme}</p>;
}
```
