# Rule: better-tailwindcss/no-restricted-classes

## Rule Description

Forbids specific utility classes named in a restriction list configured by the consumer.

## Configuration

```js
{
  // ...
  'better-tailwindcss/no-restricted-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Not snippet-testable

The rule only reports classes named in a restriction list. The tailwind export enables it without configuring any restricted classes (its better-tailwindcss settings are empty), so no class list can trigger it under the shipped config. If a restriction list is ever configured, this file should gain Bad/Good snippets using that list.
