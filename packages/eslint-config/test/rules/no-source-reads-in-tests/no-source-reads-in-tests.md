# Rule: no-source-reads-in-tests/no-source-reads-in-tests

## Rule Description

Test files must not read JS/TS source files: source-string pins protect spelling, not behavior, so a test should assert behavior (rendering or prop-capture) instead of reading a source file's text. Reads of data files, declaration files, and built `dist/` output are not flagged.

## Configuration

```js
{
  // ...
  'no-source-reads-in-tests/no-source-reads-in-tests': 'warn',
  // ...
}
```

## Test setup

- Export: jest
- File: fixture.test.ts

## Bad

```js
import {readFileSync} from 'node:fs';
export const source = readFileSync('src/widgets/Badge.tsx', 'utf8');
```

## Good

```js
import {readFileSync} from 'node:fs';
export const pkg = readFileSync('package.json', 'utf8');
```
