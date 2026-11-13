# Rule: import-x/no-absolute-path

## Rule Description

Forbids absolute filesystem paths in imports, which only ever work on the machine they were written on.

## Configuration

```js
{
  // ...
  'import-x/no-absolute-path': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import config from '/etc/service/config.js';
export default config;
```

## Good

```js
import config from './config.js';
export default config;
```
