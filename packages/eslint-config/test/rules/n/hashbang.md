# Rule: n/hashbang

## Rule Description

Requires executable files to open with the canonical `#!/usr/bin/env node` hashbang.

## Configuration

```js
{
  // ...
  'n/hashbang': 'error',
  // ...
}
```

## Test setup

- Export: node
- File: fixture.js

## Not snippet-testable

The rule decides from the linted file itself whether a shebang belongs there at all — it checks the file against the package's bin entries and executable bit on disk. A snippet is linted as a virtual file that is never a bin entry, so the rule reports "This file needs no shebang" for any content containing one and cannot distinguish a correct hashbang from an incorrect one.
