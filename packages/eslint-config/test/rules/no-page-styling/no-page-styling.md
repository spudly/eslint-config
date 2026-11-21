# Rule: no-page-styling/no-page-styling

## Rule Description

Scoped files must not apply styling directly: no imports from `tamagui` or any `@tamagui/*` package, no `className`, and no inline `style` prop. Styling belongs in reusable components, driven by semantic props; the consuming repo scopes the rule to its page/view (or app) files, since the export carries no `files:` globs of its own.

## Configuration

```js
{
  // ...
  'no-page-styling/no-page-styling': 'warn',
  // ...
}
```

## Test setup

- Export: noPageStyling
- File: fixture.js

## Bad

```js
export const ExamplePage = () => <div className="x" />;
```

## Good

```js
export const ExamplePage = ({items}) => <RecipesPage items={items} />;
```
