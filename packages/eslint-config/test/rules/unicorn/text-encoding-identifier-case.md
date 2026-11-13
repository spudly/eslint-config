# Rule: unicorn/text-encoding-identifier-case

## Rule Description

Requires the UTF-8 encoding identifier to be written in its canonical form, utf8, matching the spelling Node's own APIs use.

## Configuration

```js
{
  // ...
  'unicorn/text-encoding-identifier-case': [
    'error',
    {withDash: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const encoding = 'utf-8';
export default encoding;
```

## Good

```js
const encoding = 'utf8';
export default encoding;
```
