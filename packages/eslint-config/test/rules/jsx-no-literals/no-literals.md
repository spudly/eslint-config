# Rule: jsx-no-literals/no-literals

## Rule Description

Bans hard-coded user-facing string literals in JSX: string literals as JSX children and string literals in the user-facing props `aria-label`, `alt`, `placeholder`, and `title`, so copy flows through the i18n voice/catalog machinery. Literals with no letters or numbers (punctuation, symbols) and literals in other attributes are allowed.

## Configuration

```js
{
  // ...
  'jsx-no-literals/no-literals': [
    'warn',
    {
      noStrings: true,
      restrictedAttributes: ['aria-label', 'alt', 'placeholder', 'title'],
    },
  ],
  // ...
}
```

## Test setup

- Export: react
- File: fixture.jsx

## Bad

```js
export const Greeting = () => <div>Hello</div>;
```

## Good

```js
export const Greeting = ({label}) => <div>{label}</div>;
```
