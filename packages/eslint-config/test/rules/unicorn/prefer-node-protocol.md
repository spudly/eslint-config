# Rule: unicorn/prefer-node-protocol

## Rule Description

Requires the node: protocol when importing Node.js builtins, so builtins are distinguishable from packages at a glance.

## Configuration

```js
{
  // ...
  'unicorn/prefer-node-protocol': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import fs from 'fs';
```

## Good

```js
import fs from 'node:fs';
```
