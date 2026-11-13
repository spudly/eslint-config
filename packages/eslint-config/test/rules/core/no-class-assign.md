# Rule: no-class-assign

## Rule Description

Forbids reassigning a class binding, which would replace the constructor after other code may have captured it.

## Configuration

```js
{
  // ...
  'no-class-assign': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
class Widget {}
Widget = createWidget();
```

## Good

```js
class Widget {}
const widget = new Widget();
```
