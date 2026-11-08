/**
 * Ported from eslint-plugin-react 7.37.5 (MIT) — see NOTICE.
 *
 * The `jsx-no-literals` plugin — a TypeScript port of upstream
 * `react/jsx-no-literals` (eslint-plugin-react), which bans hard-coded
 * user-facing string literals in JSX so copy flows through the i18n
 * voice/catalog machinery instead (issue #42; design-system #539).
 *
 * Upstream cannot be installed: eslint-plugin-react 7.37.5 (latest)
 * declares peer `eslint: ^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7` —
 * no ESLint 10 — the same failure class that forced the react-native
 * vendoring (#5). The `@eslint-react` suite this package already
 * depends on has no equivalent rule. So the rule is ported here as a
 * local plugin, following the coverage-ignore / test-colocation
 * pattern, on ESLint 10 rule APIs (`context.sourceCode`) with native
 * iteration instead of upstream's `es-iterator-helpers` polyfills and
 * no new runtime dependency.
 *
 * Option names and semantics are preserved from upstream (`noStrings`,
 * `allowedStrings`, `ignoreProps`, `noAttributeStrings`,
 * `elementOverrides`), with two deliberate adaptations:
 *
 * 1. `restrictedAttributes` (an array of attribute names): when set,
 *    string-literal attribute values are reported only for the named
 *    attributes. Upstream's attribute check is blanket under
 *    `noStrings` — it would ban non-copy attribute strings
 *    (`type="button"`, `href`, ids) that are not user-facing text.
 *    The shipped configuration (src/jsx-no-literals.ts) names the
 *    user-facing string props from issue #42: `aria-label`, `alt`,
 *    `placeholder`, `title`. When the option is absent or empty, the
 *    upstream blanket behavior applies unchanged.
 * 2. A literal containing no letters or numbers (whitespace-only —
 *    already ignored upstream — punctuation-only, or symbols) is
 *    allowed: it is not user-facing copy. This is the issue's "narrow,
 *    explicit allowlist", implemented as one small tested helper
 *    rather than an ever-growing `allowedStrings` list.
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the ported code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

type ElementConfig = {
  type: 'element';
  noStrings: boolean;
  allowedStrings: Set<string>;
  ignoreProps: boolean;
  noAttributeStrings: boolean;
  restrictedAttributes: Set<string>;
};

type OverrideConfig = Omit<ElementConfig, 'type'> & {
  type: 'override';
  name: string;
  allowElement: boolean;
  applyToNestedElements: boolean;
};

type ResolvedConfig = ElementConfig | OverrideConfig;

type Config = ElementConfig & {
  elementOverrides: Record<string, OverrideConfig>;
};

type RawElementConfig = {
  noStrings?: boolean;
  allowedStrings?: string[];
  ignoreProps?: boolean;
  noAttributeStrings?: boolean;
  restrictedAttributes?: string[];
};

type RawConfig = RawElementConfig & {
  elementOverrides?: Record<
    string,
    RawElementConfig & {allowElement?: boolean; applyToNestedElements?: boolean}
  >;
};

function trimIfString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;

/** True when a literal's text carries letters or numbers — i.e. copy. */
function hasLettersOrNumbers(value: string): boolean {
  return LETTER_OR_NUMBER.test(value);
}

const reOverridableElement = /^[A-Z][\w.]*$/;
const reIsWhiteSpace = /^[\s]+$/;
const jsxElementTypes = new Set(['JSXElement', 'JSXFragment']);
const standardJSXNodeParentTypes = new Set([
  'JSXAttribute',
  'JSXElement',
  'JSXExpressionContainer',
  'JSXFragment',
]);

const messages = {
  invalidPropValue: 'Invalid prop value: "{{text}}"',
  invalidPropValueInElement: 'Invalid prop value: "{{text}}" in {{element}}',
  noStringsInAttributes: 'Strings not allowed in attributes: "{{text}}"',
  noStringsInAttributesInElement:
    'Strings not allowed in attributes: "{{text}}" in {{element}}',
  noStringsInJSX: 'Strings not allowed in JSX files: "{{text}}"',
  noStringsInJSXInElement:
    'Strings not allowed in JSX files: "{{text}}" in {{element}}',
  literalNotInJSXExpression:
    'Missing JSX expression container around literal string: "{{text}}"',
  literalNotInJSXExpressionInElement:
    'Missing JSX expression container around literal string: "{{text}}" in {{element}}',
};

const commonPropertiesSchema = {
  noStrings: {type: 'boolean'},
  allowedStrings: {
    type: 'array',
    uniqueItems: true,
    items: {type: 'string'},
  },
  ignoreProps: {type: 'boolean'},
  noAttributeStrings: {type: 'boolean'},
  restrictedAttributes: {
    type: 'array',
    uniqueItems: true,
    items: {type: 'string'},
  },
};

/** Normalizes the element portion of the config. */
function normalizeElementConfig(config: RawElementConfig): ElementConfig {
  return {
    type: 'element',
    noStrings: !!config.noStrings,
    allowedStrings: new Set(
      (config.allowedStrings ?? []).map(value => trimIfString(value) as string),
    ),
    ignoreProps: !!config.ignoreProps,
    noAttributeStrings: !!config.noAttributeStrings,
    restrictedAttributes: new Set(config.restrictedAttributes ?? []),
  };
}

/** Normalizes the config and applies default values to all options. */
function normalizeConfig(config: RawConfig): Config {
  const normalizedConfig: Config = {
    ...normalizeElementConfig(config),
    elementOverrides: {},
  };

  if (config.elementOverrides) {
    normalizedConfig.elementOverrides = Object.fromEntries(
      Object.entries(config.elementOverrides).flatMap(
        ([elementName, rawElementConfig]) => {
          if (!reOverridableElement.test(elementName)) {
            return [];
          }
          const override: OverrideConfig = {
            ...normalizeElementConfig(rawElementConfig),
            type: 'override',
            name: elementName,
            allowElement: !!rawElementConfig.allowElement,
            applyToNestedElements:
              typeof rawElementConfig.applyToNestedElements === 'undefined' ||
              !!rawElementConfig.applyToNestedElements,
          };
          return [[elementName, override] as [string, OverrideConfig]];
        },
      ),
    );
  }

  return normalizedConfig;
}

const elementOverridesSchema = {
  type: 'object',
  patternProperties: {
    [reOverridableElement.source]: {
      type: 'object',
      properties: {
        applyToNestedElements: {type: 'boolean'},
        ...commonPropertiesSchema,
      },
    },
  },
};

const jsxNoLiteralsRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of string literals in JSX',
      url: 'https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md',
    },
    messages,
    schema: [
      {
        type: 'object',
        properties: {
          elementOverrides: elementOverridesSchema,
          ...commonPropertiesSchema,
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const rawConfig: RawConfig =
      (context.options.length && (context.options[0] as RawConfig)) || {};
    const config = normalizeConfig(rawConfig);

    const hasElementOverrides = Object.keys(config.elementOverrides).length > 0;

    const renamedImportMap = new Map<string, string>();

    /**
     * Determines if the given expression is a require statement.
     * Supports nested MemberExpressions, i.e. `require('foo').nested`.
     */
    function isRequireStatement(node: AstNode): boolean {
      if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier') {
          return node.callee.name === 'require';
        }
      }
      if (node.type === 'MemberExpression') {
        return isRequireStatement(node.object);
      }
      return false;
    }

    type ElementNameFragment = {name: string; compoundName?: string};

    /**
     * Gets the name of the given JSX element. Supports nested
     * JSXMemberExpressions, i.e. `<Namespace.Component.SubComponent />`.
     */
    function getJSXElementName(node: AstNode): ElementNameFragment | undefined {
      if (node.openingElement.name.type === 'JSXIdentifier') {
        const name: string = node.openingElement.name.name;
        return {
          name: renamedImportMap.get(name) || name,
          compoundName: undefined,
        };
      }

      const nameFragments: string[] = [];

      if (node.openingElement.name.type === 'JSXMemberExpression') {
        let current: AstNode = node.openingElement.name;
        while (current.type === 'JSXMemberExpression') {
          if (current.property.type === 'JSXIdentifier') {
            nameFragments.unshift(current.property.name);
          }
          current = current.object;
        }

        if (current.type === 'JSXIdentifier') {
          nameFragments.unshift(current.name);

          const rootFragment = nameFragments[0];
          if (rootFragment) {
            const rootFragmentRenamed = renamedImportMap.get(rootFragment);
            if (rootFragmentRenamed) {
              nameFragments[0] = rootFragmentRenamed;
            }
          }

          const nameFragment = nameFragments[nameFragments.length - 1];
          if (nameFragment) {
            return {name: nameFragment, compoundName: nameFragments.join('.')};
          }
        }
      }
      return undefined;
    }

    /** Gets all JSXElement ancestor nodes for the given node. */
    function getJSXElementAncestors(node: AstNode): AstNode[] {
      const ancestors: AstNode[] = [];
      let current: AstNode = node;
      while (current) {
        if (current.type === 'JSXElement') {
          ancestors.push(current);
        }
        current = current.parent;
      }
      return ancestors;
    }

    function getParentIgnoringBinaryExpressions(node: AstNode): AstNode {
      let current: AstNode = node;
      while (current.parent.type === 'BinaryExpression') {
        current = current.parent;
      }
      return current.parent;
    }

    function getParentAndGrandParent(node: AstNode): {
      parent: AstNode;
      grandParent: AstNode;
    } {
      const parent = getParentIgnoringBinaryExpressions(node);
      return {parent, grandParent: parent.parent};
    }

    function hasJSXElementParentOrGrandParent(node: AstNode): boolean {
      const {parent, grandParent} = getParentAndGrandParent(node);
      return [parent, grandParent].some(parentNode =>
        jsxElementTypes.has(parentNode.type),
      );
    }

    /**
     * Determines whether a given node's value and its immediate parent
     * are viable text nodes that can/should be reported on.
     */
    function isViableTextNode(
      node: AstNode,
      resolvedConfig: ResolvedConfig,
    ): boolean {
      // Adaptation 2: a literal with no letters or numbers is not copy.
      if (typeof node.value === 'string' && !hasLettersOrNumbers(node.value)) {
        return false;
      }
      const textValues = [trimIfString(node.raw), trimIfString(node.value)];
      if (
        textValues.some(value =>
          resolvedConfig.allowedStrings.has(value as string),
        )
      ) {
        return false;
      }

      const parent = getParentIgnoringBinaryExpressions(node);

      let isStandardJSXNode = false;
      if (
        typeof node.value === 'string' &&
        !reIsWhiteSpace.test(node.value) &&
        standardJSXNodeParentTypes.has(parent.type)
      ) {
        if (resolvedConfig.noAttributeStrings) {
          isStandardJSXNode =
            parent.type === 'JSXAttribute' || parent.type === 'JSXElement';
        } else {
          isStandardJSXNode = parent.type !== 'JSXAttribute';
        }
      }

      if (resolvedConfig.noStrings) {
        return isStandardJSXNode;
      }

      return isStandardJSXNode && parent.type !== 'JSXExpressionContainer';
    }

    /**
     * Gets an override config for a given node, traversing the ancestor
     * tree for an override that also applies to the current node.
     */
    function getOverrideConfig(node: AstNode): OverrideConfig | undefined {
      if (!hasElementOverrides) {
        return undefined;
      }

      const allAncestorElements = getJSXElementAncestors(node);
      if (!allAncestorElements.length) {
        return undefined;
      }

      for (const ancestorElement of allAncestorElements) {
        const isClosestJSXAncestor = ancestorElement === allAncestorElements[0];

        const ancestor = getJSXElementName(ancestorElement);
        if (ancestor?.name) {
          const ancestorElements = config.elementOverrides[ancestor.name];
          const ancestorConfig = ancestor.compoundName
            ? config.elementOverrides[ancestor.compoundName] || ancestorElements
            : ancestorElements;

          if (ancestorConfig) {
            if (isClosestJSXAncestor || ancestorConfig.applyToNestedElements) {
              return ancestorConfig;
            }
          }
        }
      }
      return undefined;
    }

    function shouldAllowElement(resolvedConfig: ResolvedConfig): boolean {
      return (
        resolvedConfig.type === 'override' && !!resolvedConfig.allowElement
      );
    }

    function defaultMessageId(
      ancestorIsJSXElement: boolean,
      resolvedConfig: ResolvedConfig,
    ): string {
      if (resolvedConfig.noAttributeStrings && !ancestorIsJSXElement) {
        return resolvedConfig.type === 'override'
          ? 'noStringsInAttributesInElement'
          : 'noStringsInAttributes';
      }

      if (resolvedConfig.noStrings) {
        return resolvedConfig.type === 'override'
          ? 'noStringsInJSXInElement'
          : 'noStringsInJSX';
      }

      return resolvedConfig.type === 'override'
        ? 'literalNotInJSXExpressionInElement'
        : 'literalNotInJSXExpression';
    }

    function reportLiteralNode(
      node: AstNode,
      messageId: string,
      resolvedConfig: ResolvedConfig,
    ): void {
      context.report({
        node,
        messageId,
        data: {
          text: context.sourceCode.getText(node).trim(),
          element:
            resolvedConfig.type === 'override' ? resolvedConfig.name : '',
        },
      });
    }

    const visitors: Record<string, (node: AstNode) => void> = {
      Literal(node: AstNode) {
        const resolvedConfig = getOverrideConfig(node) || config;

        const hasJSXParentOrGrandParent =
          hasJSXElementParentOrGrandParent(node);
        if (hasJSXParentOrGrandParent && shouldAllowElement(resolvedConfig)) {
          return;
        }

        if (isViableTextNode(node, resolvedConfig)) {
          if (hasJSXParentOrGrandParent || !config.ignoreProps) {
            reportLiteralNode(
              node,
              defaultMessageId(hasJSXParentOrGrandParent, resolvedConfig),
              resolvedConfig,
            );
          }
        }
      },

      JSXAttribute(node: AstNode) {
        const isLiteralString =
          node.value &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string';
        const isStringLiteral =
          node.value && node.value.type === 'StringLiteral';

        if (isLiteralString || isStringLiteral) {
          const resolvedConfig = getOverrideConfig(node) || config;
          const value: string = node.value.value;

          // Adaptation 2: punctuation/symbol-only values are not copy.
          if (!hasLettersOrNumbers(value)) {
            return;
          }
          if (resolvedConfig.allowedStrings.has(value)) {
            return;
          }

          // Adaptation 1: with `restrictedAttributes` set, only the
          // named attributes are reported; without it, upstream's
          // blanket `noStrings` attribute check applies.
          if (resolvedConfig.restrictedAttributes.size > 0) {
            const attributeName =
              node.name.type === 'JSXIdentifier' ? node.name.name : undefined;
            if (
              !attributeName ||
              !resolvedConfig.restrictedAttributes.has(attributeName)
            ) {
              return;
            }
            const messageId =
              resolvedConfig.type === 'override'
                ? 'invalidPropValueInElement'
                : 'invalidPropValue';
            reportLiteralNode(node, messageId, resolvedConfig);
            return;
          }

          if (resolvedConfig.noStrings && !resolvedConfig.ignoreProps) {
            const messageId =
              resolvedConfig.type === 'override'
                ? 'invalidPropValueInElement'
                : 'invalidPropValue';
            reportLiteralNode(node, messageId, resolvedConfig);
          }
        }
      },

      JSXText(node: AstNode) {
        const resolvedConfig = getOverrideConfig(node) || config;

        if (shouldAllowElement(resolvedConfig)) {
          return;
        }

        if (isViableTextNode(node, resolvedConfig)) {
          const hasJSXParentOrGrandParent =
            hasJSXElementParentOrGrandParent(node);
          reportLiteralNode(
            node,
            defaultMessageId(hasJSXParentOrGrandParent, resolvedConfig),
            resolvedConfig,
          );
        }
      },

      TemplateLiteral(node: AstNode) {
        const {parent, grandParent} = getParentAndGrandParent(node);
        const isParentJSXExpressionContainer =
          parent.type === 'JSXExpressionContainer';
        const isParentJSXElement = grandParent.type === 'JSXElement';

        if (isParentJSXExpressionContainer) {
          const resolvedConfig = getOverrideConfig(node) || config;

          // Adaptation 1: a template literal in an attribute value is
          // reported only for a restricted attribute when the option
          // is set (upstream reports it for every attribute).
          if (
            grandParent.type === 'JSXAttribute' &&
            resolvedConfig.restrictedAttributes.size > 0
          ) {
            const attributeName =
              grandParent.name.type === 'JSXIdentifier'
                ? grandParent.name.name
                : undefined;
            if (
              !attributeName ||
              !resolvedConfig.restrictedAttributes.has(attributeName)
            ) {
              return;
            }
          }

          if (
            resolvedConfig.noStrings &&
            (isParentJSXElement || !resolvedConfig.ignoreProps)
          ) {
            reportLiteralNode(
              node,
              defaultMessageId(isParentJSXElement, resolvedConfig),
              resolvedConfig,
            );
          }
        }
      },
    };

    if (hasElementOverrides) {
      // Get renamed import local names mapped to their imported name.
      visitors.ImportDeclaration = (node: AstNode) => {
        node.specifiers
          .filter((specifier: AstNode) => specifier.type === 'ImportSpecifier')
          .forEach((specifier: AstNode) => {
            renamedImportMap.set(
              (specifier.local || specifier.imported).name,
              specifier.imported.name,
            );
          });
      };

      // Get renamed destructured local names mapped to their imported name.
      visitors.VariableDeclaration = (node: AstNode) => {
        node.declarations
          .filter(
            (declaration: AstNode) =>
              declaration.type === 'VariableDeclarator' &&
              isRequireStatement(declaration.init) &&
              declaration.id.type === 'ObjectPattern',
          )
          .forEach((declaration: AstNode) => {
            declaration.id.properties
              .filter(
                (property: AstNode) =>
                  property.type === 'Property' &&
                  property.key.type === 'Identifier' &&
                  property.value.type === 'Identifier',
              )
              .forEach((property: AstNode) => {
                renamedImportMap.set(property.value.name, property.key.name);
              });
          });
      };
    }

    return visitors;
  },
};

const jsxNoLiteralsPlugin = {
  meta: {
    name: '@spudly/eslint-config (ported eslint-plugin-react jsx-no-literals)',
    version: '7.37.5',
  },
  rules: {'no-literals': jsxNoLiteralsRule},
};

export default jsxNoLiteralsPlugin;
