# Rule: no-unreachable-loop

## Rule Description

Forbids loops whose body always exits on the first iteration, making the loop pointless.

## Configuration

```js
{
  // ...
  'no-unreachable-loop': [
    'error',
    {ignore: []},
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
for (let index = 0; index < 10; index++) {
  break;
}
```

## Good

```js
for (let index = 0; index < 10; index++) {
  if (done(index)) {
    break;
  }
}
```
