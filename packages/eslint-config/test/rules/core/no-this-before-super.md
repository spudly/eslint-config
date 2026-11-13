# Rule: no-this-before-super

## Rule Description

Forbids using this in a derived constructor before super() runs, which throws at runtime.

## Configuration

```js
{
  // ...
  'no-this-before-super': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
class Base {}
class Child extends Base {
  constructor() {
    this.ready = true;
    super();
  }
}
```

## Good

```js
class Base {}
class Child extends Base {
  constructor() {
    super();
    this.ready = true;
  }
}
```
