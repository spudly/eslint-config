# Rule: better-tailwindcss/enforce-consistent-class-order

## Rule Description

Requires utility classes to follow the canonical Tailwind ordering, so class lists diff cleanly and scan predictably.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-consistent-class-order': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="items-center flex" />;
}
```

## Good

```js
export function Box() {
  return <div className="flex items-center" />;
}
```
