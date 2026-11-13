# Rule: import-x/no-cycle

## Rule Description

Forbids import cycles between modules, which produce partially initialized bindings and order-dependent behavior.

## Configuration

```js
{
  // ...
  'import-x/no-cycle': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Not snippet-testable

The rule detects import cycles between real files on disk. A snippet has no neighbouring modules to import, so there is no cycle a fixture could form without inventing a fake module graph.
