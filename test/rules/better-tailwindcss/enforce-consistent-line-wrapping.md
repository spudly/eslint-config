# Rule: better-tailwindcss/enforce-consistent-line-wrapping

## Rule Description

Requires class lists that exceed the print width to wrap across lines instead of running on, so wide class lists stay readable. The export passes the rule no options, so the plugin's default print width of 80 characters is the budget a class list must fit.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-consistent-line-wrapping': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

<!-- prettier-ignore -->
```js
export function Box() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-md" />
  );
}
```

## Good

<!-- prettier-ignore -->
```js
export function Box() {
  return (
    <div className="
      flex items-center justify-between gap-4 rounded-lg border border-gray-300
      bg-white px-4 py-2 shadow-md
    " />
  );
}
```
