# Rule: import-x/newline-after-import

## Rule Description

Requires a blank line between the import block and the rest of the module, so dependencies read as their own section.

## Configuration

```js
{
  // ...
  'import-x/newline-after-import': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import fs from 'node:fs';
run(fs);
```

## Good

```js
import fs from 'node:fs';

run(fs);
```
