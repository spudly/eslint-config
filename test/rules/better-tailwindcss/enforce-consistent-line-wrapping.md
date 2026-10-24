# Rule: better-tailwindcss/enforce-consistent-line-wrapping

## Rule Description

Requires long class lists to wrap one class per line past the configured line width, so wide class lists stay readable.

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

## Not snippet-testable

The rule wraps long class lists across lines against a maximum line length. The tailwind export passes it no options and gives it no line-width budget, and every class list these snippets can reasonably contain fits on one line — there is no honest way to construct a Bad case that trips a limit the shipped config does not set. If the export ever configures a width, this file should gain Bad/Good snippets.
