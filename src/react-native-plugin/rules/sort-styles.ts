/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Rule to require StyleSheet object keys to be sorted
 * @author Mats Byrkjeland
 *
 * ESLint 10 adaptation: `context.getSourceCode()` became
 * `context.sourceCode`.
 */
import type {Rule} from 'eslint';

import {astHelpers} from '../util/stylesheet.js';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

const {
  getStyleDeclarationsChunks,
  getPropertiesChunks,
  getStylePropertyIdentifier,
  isStyleSheetDeclaration,
  isEitherShortHand,
} = astHelpers;

const rule: Rule.RuleModule = {
  create(context) {
    const order = (context.options[0] as string | undefined) || 'asc';
    const options =
      (context.options[1] as
        | {ignoreClassNames?: boolean; ignoreStyleProperties?: boolean}
        | undefined) || {};
    const {ignoreClassNames} = options;
    const {ignoreStyleProperties} = options;
    const isValidOrder =
      order === 'asc'
        ? (a: string, b: string) => a <= b
        : (a: string, b: string) => a >= b;

    const sourceCode = context.sourceCode;

    function sort(array: AstNode[]): AstNode[] {
      return [...array].sort((a, b) => {
        const identifierA = getStylePropertyIdentifier(a);
        const identifierB = getStylePropertyIdentifier(b);

        let sortOrder = 0;
        if (isEitherShortHand(identifierA, identifierB)) {
          return a.range[0] - b.range[0];
        }
        if (identifierA < identifierB) {
          sortOrder = -1;
        } else if (identifierA > identifierB) {
          sortOrder = 1;
        }
        return sortOrder * (order === 'asc' ? 1 : -1);
      });
    }

    function report(
      array: AstNode[],
      type: string,
      node: AstNode,
      prev: AstNode,
      current: AstNode,
    ): void {
      const currentName = getStylePropertyIdentifier(current);
      const prevName = getStylePropertyIdentifier(prev);
      const hasComments = array
        .map(prop => [
          ...sourceCode.getCommentsBefore(prop),
          ...sourceCode.getCommentsAfter(prop),
        ])
        .reduce(
          (hasComment, comment) => hasComment || comment.length > 0,
          false,
        );

      context.report({
        fix: hasComments
          ? undefined
          : fixer => {
              const sortedArray = sort(array);
              return array
                .map((item, i) => {
                  if (item !== sortedArray[i]) {
                    return fixer.replaceText(
                      item,
                      sourceCode.getText(sortedArray[i] as AstNode),
                    );
                  }
                  return null;
                })
                .filter(Boolean) as ReturnType<typeof fixer.replaceText>[];
            },
        loc: current.key.loc,
        message: `Expected ${type} to be in ${order}ending order. '${currentName}' should be before '${prevName}'.`,
        node,
      });
    }

    function checkIsSorted(
      array: AstNode[],
      arrayName: string,
      node: AstNode,
    ): void {
      for (let i = 1; i < array.length; i += 1) {
        const previous = array[i - 1] as AstNode;
        const current = array[i] as AstNode;

        if (previous.type !== 'Property' || current.type !== 'Property') {
          return;
        }

        const prevName = getStylePropertyIdentifier(previous);
        const currentName = getStylePropertyIdentifier(current);

        const oneIsShorthandForTheOther =
          arrayName === 'style properties' &&
          isEitherShortHand(prevName, currentName);

        if (
          !oneIsShorthandForTheOther &&
          !isValidOrder(prevName, currentName)
        ) {
          report(array, arrayName, node, previous, current);
          return;
        }
      }
    }

    return {
      CallExpression(node: AstNode) {
        if (!isStyleSheetDeclaration(node, context.settings)) {
          return;
        }

        const classDefinitionsChunks = getStyleDeclarationsChunks(node);

        if (!ignoreClassNames) {
          classDefinitionsChunks.forEach(classDefinitions => {
            checkIsSorted(classDefinitions, 'class names', node);
          });
        }

        if (ignoreStyleProperties) return;

        classDefinitionsChunks.forEach(classDefinitions => {
          classDefinitions.forEach(classDefinition => {
            const styleProperties = classDefinition.value.properties;
            if (!styleProperties || styleProperties.length < 2) {
              return;
            }
            const stylePropertyChunks = getPropertiesChunks(styleProperties);
            stylePropertyChunks.forEach(stylePropertyChunk => {
              checkIsSorted(stylePropertyChunk, 'style properties', node);
            });
          });
        });
      },
    };
  },
  meta: {
    fixable: 'code',
    schema: [
      {
        enum: ['asc', 'desc'],
      },
      {
        additionalProperties: false,
        properties: {
          ignoreClassNames: {
            type: 'boolean',
          },
          ignoreStyleProperties: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
  },
};

export default rule;
