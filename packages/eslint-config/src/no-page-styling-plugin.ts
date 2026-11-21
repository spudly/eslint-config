import type {ESLint} from 'eslint';

/**
 * The `no-page-styling` plugin — a TypeScript port of the
 * design-system's local `design-system/no-page-styling` rule
 * (`eslintRules/noPageStyling.mjs` in spudly/design-system),
 * promoted into this shared package by issue #60 so the design
 * system, Eciperay, and Memorize can all consume it instead of the
 * rule living DS-locally. Stephen directed the promotion on
 * 2026-11-21: only DS widgets may use Tamagui components or style
 * props; app and page code composes `@spudly/ui` pages/widgets and
 * passes data/callbacks only (design-system #119; extended to views
 * by design-system #698).
 *
 * Semantics are the DS rule's, unchanged (design-system #297): the
 * rule enforces exactly three things for any file the consumer's
 * config scopes it to:
 *
 * 1. No direct Tamagui imports: the file must not import from
 *    `tamagui` or any `@tamagui/*` package. Tamagui elements and
 *    layout primitives live inside reusable components; scoped
 *    files compose those components.
 * 2. No `className` on any element.
 * 3. No inline `style` prop on any element.
 *
 * Styling lives in reusable components, driven by semantic props:
 * `<Alert intent="error">`, never `<div style={{ color: "red" }}>`.
 *
 * The DS rule's earlier shape also enumerated Tamagui's style props
 * and banned them on every element; Stephen superseded that part on
 * design-system #297 (Tamagui elements are already import-banned in
 * scoped files, DOM elements do not accept Tamagui style props, and
 * design-system components are contractually barred from accepting
 * styling props), so the enumeration is NOT reintroduced here.
 *
 * The one deliberate adaptation in the port: the report messages
 * are worded repo-neutrally ("a reusable component") instead of
 * naming the design system's `src/widgets` directory — this package
 * bakes in no repo's layout (Stephen, 2026-10-24). The messageIds
 * and the import-source handling are carried over exactly.
 *
 * Dormancy: typescript-eslint has no TypeScript 7 parser yet, so
 * the shared `typescriptPendingIgnores` block ignores every
 * .ts/.tsx file and the rule cannot fire on TSX in CI today. It
 * activates with no further change the moment the TS lint
 * restoration removes that ignores block (issue #8 tracks the
 * restoration) — the same dormancy the DS-local copy has today.
 */

// AST nodes are handled structurally in the ported code, so this
// alias is intentionally `any` (same as the jsx-no-literals port).
type AstNode = any;

/**
 * The statically known value of a dynamic import's source, or
 * undefined when it is not static: string literals and
 * substitution-free template literals are known; anything else
 * (identifiers, interpolated templates, calls) is a runtime value
 * the rule cannot classify.
 */
function importSourceValue(source: AstNode): string | undefined {
  if (source.type === 'Literal') return source.value as string;
  if (source.type === 'TemplateLiteral' && source.expressions.length === 0) {
    return source.quasis[0]?.value.cooked as string | undefined;
  }
  return undefined;
}

function isTamaguiSource(source: unknown): source is string {
  return (
    typeof source === 'string' &&
    (source === 'tamagui' ||
      source.startsWith('tamagui/') ||
      source.startsWith('@tamagui/'))
  );
}

/**
 * The slice of the rule context `checkAttribute` needs. The plugin
 * context's generic SourceCode type is not assignable to the plain
 * `Rule.RuleContext`, so the helper takes this structural minimum.
 */
type ReportContext = {
  report(descriptor: {node: AstNode; messageId: string}): void;
};

function checkAttribute(context: ReportContext, attribute: AstNode): void {
  if (attribute.type !== 'JSXAttribute') return;
  const {name} = attribute.name;
  if (name === 'className') {
    context.report({node: attribute, messageId: 'className'});
  } else if (name === 'style') {
    context.report({node: attribute, messageId: 'styleProp'});
  }
}

const noPageStylingPlugin: ESLint.Plugin = {
  rules: {
    'no-page-styling': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Scoped files must not apply styling directly: no direct Tamagui imports, no className, no inline style prop; styling belongs in reusable components behind semantic props.',
        },
        messages: {
          tamaguiImport:
            "Scoped files must not import from '{{source}}' directly. Tamagui belongs inside reusable components; scoped files compose those components with semantic props instead.",
          className:
            'Scoped files must not set className. Move the styling into a reusable component and pass semantic props instead.',
          styleProp:
            'Scoped files must not set the inline style prop. Move the styling into a reusable component and pass semantic props instead.',
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node: AstNode) {
            if (isTamaguiSource(node.source.value)) {
              context.report({
                node,
                messageId: 'tamaguiImport',
                data: {source: node.source.value as string},
              });
            }
          },
          ImportExpression(node: AstNode) {
            const source = importSourceValue(node.source);
            if (isTamaguiSource(source)) {
              context.report({
                node,
                messageId: 'tamaguiImport',
                data: {source},
              });
            }
          },
          JSXOpeningElement(node: AstNode) {
            for (const attribute of node.attributes) {
              checkAttribute(context, attribute);
            }
          },
        };
      },
    },
  },
};

export default noPageStylingPlugin;
