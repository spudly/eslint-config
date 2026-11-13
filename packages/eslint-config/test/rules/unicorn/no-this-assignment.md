# Rule: unicorn/no-this-assignment

## Rule Description

Forbids assigning `this` to a variable to capture it, which arrow functions and direct references make unnecessary.

## Configuration

```js
{
  // ...
  'unicorn/no-this-assignment': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const handler = {
  onEvent() {
    const self = this;
    self.render();
  },
};
```

## Good

```js
const handler = {
  onEvent() {
    this.render();
  },
};
```
