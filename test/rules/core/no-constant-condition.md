# Rule: no-constant-condition

## Rule Description

Forbids constant conditions in if/while checks, which usually mean dead code or a placeholder left behind.

## Configuration

```js
{
  // ...
  'no-constant-condition': [
    'error',
    {checkLoops: 'allExceptWhileTrue'},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
if (true) {
  run();
}
```

## Good

```js
if (ready) {
  run();
}
```
