# Rule: no-empty-pattern

## Rule Description

Forbids empty destructuring patterns, which bind nothing and read like a mistake.

## Configuration

```js
{
  // ...
  'no-empty-pattern': [
    'error',
    {allowObjectPatternsAsParameters: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const {} = settings;
```

## Good

```js
const {mode} = settings;
```
