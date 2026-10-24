# Rule: coverage-ignore/require-description

## Rule Description

Requires Istanbul coverage-ignore comments to explain themselves: every ignore must say why the code cannot or should not be covered.

## Configuration

```js
{
  // ...
  'coverage-ignore/require-description': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
/* istanbul ignore next */
export function unsupported() {
  return load();
}
```

## Good

```js
/* istanbul ignore next -- only the live MCP host exercises this path */
export function unsupported() {
  return load();
}
```
