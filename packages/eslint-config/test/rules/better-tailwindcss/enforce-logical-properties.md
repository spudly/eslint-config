# Rule: better-tailwindcss/enforce-logical-properties

## Rule Description

Requires logical CSS properties (ms-, me-, ps-, pe-, start-, end-) over physical left/right ones, so layouts survive RTL locales.

## Configuration

```js
{
  // ...
  'better-tailwindcss/enforce-logical-properties': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="ml-4" />;
}
```

## Good

```js
export function Box() {
  return <div className="ms-4" />;
}
```
