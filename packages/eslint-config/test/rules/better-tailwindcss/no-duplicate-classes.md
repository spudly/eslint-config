# Rule: better-tailwindcss/no-duplicate-classes

## Rule Description

Forbids repeating the same utility class in one class list, which is dead text that hides the intended value.

## Configuration

```js
{
  // ...
  'better-tailwindcss/no-duplicate-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="flex flex" />;
}
```

## Good

```js
export function Box() {
  return <div className="flex" />;
}
```
