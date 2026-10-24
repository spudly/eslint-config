# Rule: unicorn/filename-case

## Rule Description

Requires filenames to be camelCase or PascalCase (with a small ignore list for config and fixture files), so a file's name predicts its contents.

## Configuration

```js
{
  // ...
  'unicorn/filename-case': [
    'error',
    {
      cases: {camelCase: true, pascalCase: true},
      ignore: [/^react-native\.config\.(?:js|cjs)$/u, /^(?:__tests__|__mocks__|mcp-server)$/u],
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule judges the name of the file being linted. Both snippets of a fixture are linted under the one filename in its Test setup, so no snippet content can make the Bad case trigger while the Good case does not — the trigger is the filename itself, which this format cannot vary per snippet.
