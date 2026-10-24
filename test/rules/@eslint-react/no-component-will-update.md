# Rule: @eslint-react/no-component-will-update

## Rule Description

Forbids the componentWillUpdate lifecycle, which is unsafe in modern React; do post-update work in componentDidUpdate.

## Configuration

```js
{
  // ...
  '@eslint-react/no-component-will-update': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
class Panel extends Component {
  componentWillUpdate() {
    measure();
  }
  render() {
    return <div />;
  }
}
```

## Good

```js
class Panel extends Component {
  componentDidUpdate() {
    measure();
  }
  render() {
    return <div />;
  }
}
```
