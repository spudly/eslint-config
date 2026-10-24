# Rule: better-tailwindcss/enforce-consistent-important-position

## Rule Description

Requires the important modifier to sit at the end of the class name in Tailwind v4 style (flex!), not the legacy prefix position.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-consistent-important-position': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="!flex" />;
}
```

## Good

```js
export function Box() {
  return <div className="flex!" />;
}
```
