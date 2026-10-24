# Rule: no-useless-computed-key

## Rule Description

Forbids computed property keys that are plain literals, where the plain key says the same thing.

## Configuration

```js
{
  // ...
  'no-useless-computed-key': [
    'error',
    {enforceForClassMembers: true},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
const record = {['id']: 1};
```

## Good

```js
const record = {id: 1};
```
