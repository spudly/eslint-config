# Rule: unicorn/expiring-todo-comments

## Rule Description

Forbids TODO comments whose stated expiry condition has already been met, so time-boxed workarounds cannot linger forever. A version condition like [>1.0.0] expires once this package's version passes it (date conditions exist too, but are not enabled in this config).

## Configuration

```js
{
  // ...
  'unicorn/expiring-todo-comments': [
    'error',
    {
      terms: ['todo', 'fixme', 'xxx'],
      ignore: [],
      checkDates: false,
      checkDatesOnPullRequests: false,
      allowWarningComments: true,
    },
  ],
  // ...
}
```

## Test setup

- Export: base
- File: fixture.ts

## Bad

```js
// TODO [>0.0.1]: remove the fallback once the config ships
run();
```

## Good

```js
// TODO [>99.0.0]: remove the fallback once the config reaches v99
run();
```
