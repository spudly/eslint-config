# Rule: n/prefer-node-protocol

## Rule Description

Requires the node: protocol when importing Node.js builtins, so builtins are distinguishable from packages at a glance.

## Configuration

```js
{
  // ...
  'n/prefer-node-protocol': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Bad

```js
import fs from 'fs';
export const reader = fs.readFile;
```

## Good

```js
import fs from 'node:fs';
export const reader = fs.readFile;
```
