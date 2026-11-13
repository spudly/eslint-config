# Rule: @eslint-react/no-context-provider

## Rule Description

React 19 renders a context object directly as a provider instead of <Context.Provider>.

## Configuration

```js
{
  // ...
  '@eslint-react/no-context-provider': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {createContext} from 'react';

const ThemeContext = createContext('light');

export function C({children}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

## Good

```js
import {createContext} from 'react';

const ThemeContext = createContext('light');

export function C({children}) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```
