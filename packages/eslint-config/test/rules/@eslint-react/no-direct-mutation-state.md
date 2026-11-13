# Rule: @eslint-react/no-direct-mutation-state

## Rule Description

Forbids mutating this.state directly outside the constructor, which bypasses React's update pipeline and can strand the UI.

## Configuration

```js
{
  // ...
  '@eslint-react/no-direct-mutation-state': 'error',
  // ...
}
```

## Test setup

- Export: reactPending
- File: fixture.tsx

## Bad

```js
class Counter extends Component {
  bump() {
    this.state.count = 1;
  }
  render() {
    return <div />;
  }
}
```

## Good

```js
class Counter extends Component {
  bump() {
    this.setState({count: 1});
  }
  render() {
    return <div />;
  }
}
```
