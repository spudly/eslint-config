# Rule: @eslint-react/dom-no-render

## Rule Description

Forbids the legacy ReactDOM.render API, which was removed in React 19; applications mount through createRoot.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-render': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
ReactDOM.render(<App />, document.getElementById('root'));
```

## Good

```js
createRoot(document.getElementById('root')).render(<App />);
```
