# Rule: n/no-exports-assign

## Rule Description

Forbids reassigning the `exports` variable itself, which silently detaches it from module.exports; assign to module.exports or exports properties instead.

## Configuration

```js
{
  // ...
  'n/no-exports-assign': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.cjs

## Bad

```js
exports = {ready: true};
```

## Good

```js
module.exports = {ready: true};
```
