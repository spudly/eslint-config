# Rule: constructor-super

## Rule Description

Requires a derived class constructor to call super(), since the instance is unusable until the base constructor runs.

## Configuration

```js
{
  // ...
  'constructor-super': 'error',
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
  constructor() {}
}
```

## Good

```js
class Base {}
class Child extends Base {
  constructor() {
    super();
  }
}
```
