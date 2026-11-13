# Rule: @eslint-react/no-component-will-mount

## Rule Description

Forbids the componentWillMount lifecycle, which is unsafe in modern React and was removed from the recommended lifecycle set.

## Configuration

```js
{
  // ...
  '@eslint-react/no-component-will-mount': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
class Panel extends Component {
  componentWillMount() {
    load();
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
    load();
  }
  render() {
    return <div />;
  }
}
```
