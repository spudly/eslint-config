# Rule: no-empty-character-class

## Rule Description

Forbids empty character classes in regexes, which never match anything and are usually a typo.

## Configuration

```js
{
  // ...
  'no-empty-character-class': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const pattern = /[]/;
```

## Good

```js
const pattern = /[a]/;
```
