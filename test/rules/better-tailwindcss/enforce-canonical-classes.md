# Rule: better-tailwindcss/enforce-canonical-classes

## Rule Description

Requires arbitrary values that have a canonical utility spelling (like w-[1rem]) to use the canonical class (w-4) instead.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-canonical-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="w-[1rem]" />;
}
```

## Good

```js
export function Box() {
  return <div className="w-4" />;
}
```
