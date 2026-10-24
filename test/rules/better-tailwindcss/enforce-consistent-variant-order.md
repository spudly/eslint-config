# Rule: better-tailwindcss/enforce-consistent-variant-order

## Rule Description

Requires stacked variants to appear in canonical order (responsive variants before state variants), so class lists scan consistently.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-consistent-variant-order': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="hover:md:flex" />;
}
```

## Good

```js
export function Box() {
  return <div className="md:hover:flex" />;
}
```
