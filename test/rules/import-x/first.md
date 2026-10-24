# Rule: import-x/first

## Rule Description

Requires import statements to come before all other statements in a module, since imports hoist and reading them mid-file hides dependencies.

## Configuration

```js
{
  // ...
  'import-x/first': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
run();
import fs from 'node:fs';
export default fs;
```

## Good

```js
import fs from 'node:fs';
run();
export default fs;
```
