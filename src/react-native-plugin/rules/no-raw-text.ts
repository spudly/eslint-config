/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Detects raw text outside of Text component
 * @author Alex Zhukov
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

const elementName = (node: AstNode): string => {
  const reversedIdentifiers: string[] = [];
  if (
    node.type === 'JSXElement' &&
    node.openingElement.type === 'JSXOpeningElement'
  ) {
    let object = node.openingElement.name;
    while (object.type === 'JSXMemberExpression') {
      if (object.property.type === 'JSXIdentifier') {
        reversedIdentifiers.push(object.property.name);
      }
      object = object.object;
    }

    if (object.type === 'JSXIdentifier') {
      reversedIdentifiers.push(object.name);
    }
  }

  return reversedIdentifiers.reverse().join('.');
};

const hasAllowedParent = (
  parent: AstNode,
  allowedElements: string[],
): boolean => {
  let curNode = parent;

  while (curNode) {
    if (curNode.type === 'JSXElement') {
      const name = elementName(curNode);
      if (allowedElements.includes(name)) {
        return true;
      }
    }
    curNode = curNode.parent;
  }

  return false;
};

const rule: Rule.RuleModule = {
  create(context) {
    const options = (context.options[0] as {skip?: string[]} | undefined) || {};

    const report = (node: AstNode): void => {
      const errorValue =
        node.type === 'TemplateLiteral'
          ? `TemplateLiteral: ${node.expressions[0].name}`
          : (node.value as string).trim();

      const formattedErrorValue =
        errorValue.length > 0 ? `Raw text (${errorValue})` : 'Whitespace(s)';

      context.report({
        message: `${formattedErrorValue} cannot be used outside of a <Text> tag`,
        node,
      });
    };

    const skippedElements = options.skip ? options.skip : [];
    const allowedElements = [
      'Text',
      'TSpan',
      'StyledText',
      'Animated.Text',
    ].concat(skippedElements);

    const hasOnlyLineBreak = (value: string): boolean =>
      /^[\r\n\t\f\v]+$/.test(value.replace(/ /g, ''));

    const getValidation = (node: AstNode): boolean =>
      !hasAllowedParent(node.parent, allowedElements);

    return {
      JSXText(node: AstNode) {
        if (typeof node.value !== 'string' || hasOnlyLineBreak(node.value))
          return;
        if (getValidation(node)) {
          report(node);
        }
      },

      Literal(node: AstNode) {
        const parentType = node.parent.type;
        const onlyFor = ['JSXExpressionContainer', 'JSXElement'];
        if (
          typeof node.value !== 'string' ||
          hasOnlyLineBreak(node.value) ||
          !onlyFor.includes(parentType) ||
          (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
        )
          return;

        const isStringLiteral = parentType === 'JSXExpressionContainer';
        if (getValidation(isStringLiteral ? node.parent : node)) {
          report(node);
        }
      },

      TemplateLiteral(node: AstNode) {
        if (
          node.parent.type !== 'JSXExpressionContainer' ||
          (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
        )
          return;

        if (getValidation(node.parent)) {
          report(node);
        }
      },
    };
  },
  meta: {
    schema: [
      {
        additionalProperties: false,
        properties: {
          skip: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
  },
};

export default rule;
