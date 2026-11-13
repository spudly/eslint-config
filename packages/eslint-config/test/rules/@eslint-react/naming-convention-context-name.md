# Rule: @eslint-react/naming-convention-context-name

## Rule Description

Identifiers assigned from createContext must be valid component names with the Context suffix.

## Configuration

```js
{
  // ...
  '@eslint-react/naming-convention-context-name': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import {createContext} from 'react';

const theme = createContext('light');

export function C() {
  return <p>{theme}</p>;
}
```

## Good

```js
import {createContext} from 'react';

const ThemeContext = createContext('light');

export function C() {
  return <p>light</p>;
}
```
