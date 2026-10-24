# Rule: @eslint-react/dom-no-hydrate

## Rule Description

Forbids the legacy ReactDOM.hydrate API, which was removed in React 19; server-rendered trees hydrate through hydrateRoot from react-dom/client.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-hydrate': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
import ReactDOM from 'react-dom';
ReactDOM.hydrate(<App />, document.getElementById('root'));
```

## Good

```js
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```
