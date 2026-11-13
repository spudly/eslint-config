# Rule: import-x/no-import-module-exports

## Rule Description

Forbids mixing an import statement with module.exports in the same file; a module is either ESM or CommonJS, not both.

## Configuration

```js
{
  // ...
  'import-x/no-import-module-exports': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import fs from 'node:fs';
module.exports = fs;
```

## Good

```js
import fs from 'node:fs';
export default fs;
```
