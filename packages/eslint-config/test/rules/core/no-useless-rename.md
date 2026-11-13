# Rule: no-useless-rename

## Rule Description

Forbids renaming an import, export, or destructured property to the same name, which adds words without information.

## Configuration

```js
{
  // ...
  'no-useless-rename': [
    'error',
    {ignoreDestructuring: false, ignoreImport: false, ignoreExport: false},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
import {readFile as readFile} from 'node:fs';
```

## Good

```js
import {readFile} from 'node:fs';
```
