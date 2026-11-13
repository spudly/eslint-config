# Rule: better-tailwindcss/no-unnecessary-whitespace

## Rule Description

Requires class lists to use single spaces between classes, with no leading or trailing whitespace.

## Configuration

```js
{
  // ...
  'better-tailwindcss/no-unnecessary-whitespace': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="flex  items-center" />;
}
```

## Good

```js
export function Box() {
  return <div className="flex items-center" />;
}
```
