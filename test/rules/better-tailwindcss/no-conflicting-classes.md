# Rule: better-tailwindcss/no-conflicting-classes

## Rule Description

Forbids classes that set the same property to different values in one list, where only one can win and the loser is a lie.

## Configuration

```js
{
  // ...
  'better-tailwindcss/no-conflicting-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Bad

```js
export function Box() {
  return <div className="flex block" />;
}
```

## Good

```js
export function Box() {
  return <div className="flex" />;
}
```
