# Rule: n/no-deprecated-api

## Rule Description

Forbids Node.js APIs deprecated within the supported engine range (Node 20 and up), such as fs.exists (deprecated since Node 4 in favour of fs.stat) and util._extend.

## Configuration

```js
{
  // ...
  'n/no-deprecated-api': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Bad

```js
import fs from 'node:fs';
export const check = file =>
  new Promise(resolve => {
    fs.exists(file, exists => resolve(exists));
  });
```

## Good

```js
import fs from 'node:fs';
export const check = file =>
  new Promise(resolve => {
    fs.stat(file, error => resolve(error === null));
  });
```
