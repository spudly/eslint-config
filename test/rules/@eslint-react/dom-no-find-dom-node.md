# Rule: @eslint-react/dom-no-find-dom-node

## Rule Description

Forbids ReactDOM.findDOMNode, which is deprecated and removed in StrictMode-era React; use refs instead.

## Configuration

```js
{
  // ...
  '@eslint-react/dom-no-find-dom-node': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
class Panel extends Component {
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    measure(node);
  }
  render() {
    return <div />;
  }
}
```

## Good

```js
class Panel extends Component {
  componentDidMount() {
    measure(this.root);
  }
  render() {
    return <div ref={node => (this.root = node)} />;
  }
}
```
