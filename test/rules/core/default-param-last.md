# Rule: default-param-last

## Rule Description

Requires parameters with defaults to come after required parameters, matching how callers actually omit them.

## Configuration

```js
{
  // ...
  'default-param-last': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.js

## Bad

```js
function greet(name = 'friend', punctuation) {
  return name + punctuation;
}
```

## Good

```js
function greet(name, punctuation = '!') {
  return name + punctuation;
}
```
