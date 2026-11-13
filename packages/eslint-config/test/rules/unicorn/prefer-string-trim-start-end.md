# Rule: unicorn/prefer-string-trim-start-end

## Rule Description

Prefers trimStart/trimEnd over the legacy trimLeft/trimRight aliases.

## Configuration

```js
{
  // ...
  'unicorn/prefer-string-trim-start-end': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const cleaned = text.trimLeft();
```

## Good

```js
const cleaned = text.trimStart();
```
