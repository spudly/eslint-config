# Rule: better-tailwindcss/enforce-consistent-variable-syntax

## Rule Description

Requires CSS variable shorthand in arbitrary values — bg-(--brand) instead of bg-[var(--brand)] — matching Tailwind v4 syntax.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="bg-[var(--brand)]" />;
}
```

## Good

```js
export function Box() {
  return <div className="bg-(--brand)" />;
}
```
