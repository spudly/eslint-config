# Rule: n/process-exit-as-throw

## Rule Description

Marks process.exit() as a throw for ESLint's code-path analysis, so core rules see the control flow the way Node executes it.

## Configuration

```js
{
  // ...
  'n/process-exit-as-throw': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Not snippet-testable

The rule never reports anything itself: it only teaches ESLint's core code-path analysis to treat process.exit() as a throw. The node export is applied on its own in these fixtures, and there is no core rule in that export whose findings would change shape in its presence, so no snippet can observe it.
