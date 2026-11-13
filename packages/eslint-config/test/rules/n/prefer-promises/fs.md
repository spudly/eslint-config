# Rule: n/prefer-promises/fs

## Rule Description

Prefers the promise-based fs API (node:fs/promises, or fs.promises) over callback-style fs functions.

## Configuration

```js
{
  // ...
  'n/prefer-promises/fs': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Bad

```js
import {readFile} from 'node:fs';
export const load = file =>
  new Promise((resolvePromise, rejectPromise) => {
    readFile(file, 'utf8', (error, text) => {
      if (error) {
        rejectPromise(error);
      } else {
        resolvePromise(text);
      }
    });
  });
```

## Good

```js
import {readFile} from 'node:fs/promises';
export const load = file => readFile(file, 'utf8');
```
