# Rule: better-tailwindcss/no-deprecated-classes

## Rule Description

Requires classes renamed in the installed Tailwind version to use their current spelling (shadow-sm became shadow-xs in v4).

## Configuration

```js
{
  // ...
  'better-tailwindcss/no-deprecated-classes': 'error',
  // ...
}
```

## Test setup

- Export: tailwind
- File: fixture.tsx

## Not snippet-testable

The rule resolves which classes are deprecated from a Tailwind CSS entry point. The tailwind export configures no entry point and a snippet cannot provide one, so the rule never evaluates class lists here — the only message it can produce in this harness is its own "no tailwind css entry point found" warning, which is not a deprecation finding and would make the fixture a lie.
