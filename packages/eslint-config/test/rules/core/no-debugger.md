# Rule: no-debugger

## Rule Description

Forbids debugger statements, which halt execution when devtools are open and must never ship.

## Configuration

```js
{
  // ...
  'no-debugger': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
debugger;
```

## Good

```js
export const debugged = true;
```
