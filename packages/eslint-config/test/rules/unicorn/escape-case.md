# Rule: unicorn/escape-case

## Rule Description

Requires hexadecimal escapes in strings and regexes to use uppercase letters, so \xFF and \u00E9 read consistently.

## Configuration

```js
{
  // ...
  'unicorn/escape-case': [
    'error',
    'uppercase',
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const letter = '\xff';
```

## Good

```js
const letter = '\xFF';
```
