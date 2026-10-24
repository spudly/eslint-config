# Rule: no-with

## Rule Description

Forbids with statements, which make it impossible to tell where a name comes from.

## Configuration

```js
{
  // ...
  'no-with': 'error',
  // ...
}
```

## Test setup

- Export: base
- File: fixture.cjs

## Bad

```js
with (record) {
  print(name);
}
```

## Good

```js
print(record.name);
```
