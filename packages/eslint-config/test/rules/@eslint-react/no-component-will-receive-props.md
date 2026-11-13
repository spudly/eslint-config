# Rule: @eslint-react/no-component-will-receive-props

## Rule Description

Forbids the componentWillReceiveProps lifecycle, which is unsafe in modern React; derive state during render or in componentDidUpdate instead.

## Configuration

```js
{
  // ...
  '@eslint-react/no-component-will-receive-props': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
class Panel extends Component {
  componentWillReceiveProps(nextProps) {
    sync(nextProps);
  }
  render() {
    return <div />;
  }
}
```

## Good

```js
class Panel extends Component {
  componentDidUpdate(prevProps) {
    sync(prevProps);
  }
  render() {
    return <div />;
  }
}
```
