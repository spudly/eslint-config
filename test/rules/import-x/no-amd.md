# Rule: import-x/no-amd

## Rule Description

Forbids AMD define/require calls; this codebase uses ES modules only.

## Configuration

```js
{
  // ...
  'import-x/no-amd': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
define(['node:fs'], fs => {
  run(fs);
});
```

## Good

```js
import fs from 'node:fs';
run(fs);
```
