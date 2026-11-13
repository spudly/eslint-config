# @spudly/commitlint-config

The shared [commitlint](https://commitlint.js.org) base config for the
Spudly repos. It wraps
[@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)
so every repo enforces the same conventional-commit contract: the
standard type enum, type/scope/subject case and emptiness rules, and
the 100-character header limit.

## Usage

Install `@commitlint/cli` and this package, then extend the base in
your repo's commitlint config:

```js
// commitlint.config.cjs
module.exports = {extends: ['@spudly/commitlint-config']};
```

Wire the commit-msg hook (husky):

```sh
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

## Layering repo-specific rules

Commit scopes and other repo-specific rules stay in each consumer, per
the tooling-monorepo epic. Layer them on top of the base instead of
forking it:

```js
module.exports = {
  extends: ['@spudly/commitlint-config'],
  rules: {
    // This repo's own rules, for example a required scope or a
    // scope allow-list plugin rule.
  },
};
```

Valid messages include `feat: add a thing` and
`fix(parser): handle an empty input`; a message with no conventional
type (`add a thing`) or an empty subject (`feat:`) is rejected.
