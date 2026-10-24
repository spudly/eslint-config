# Rule: better-tailwindcss/enforce-shorthand-classes

## Rule Description

Requires shorthand utilities where a pair of classes collapses into one, like mx/my pairs into m- or w/h pairs into size-.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-shorthand-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="w-4 h-4" />;
}
```

## Good

```js
export function Box() {
  return <div className="size-4" />;
}
```
