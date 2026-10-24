# Rule: import-x/no-commonjs

## Rule Description

Forbids the use of CommonJS syntax in ES module files; imports and exports keep one module system per file.

## Configuration

```js
{
  // ...
  'import-x/no-commonjs': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const fs = require('node:fs');
export default fs;
```

## Good

```js
import fs from 'node:fs';
export default fs;
```
