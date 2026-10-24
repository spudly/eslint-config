/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Detects unused styles
 * @author Tom Hastjarjanto
 */
import type {Rule} from 'eslint';

import {Components} from '../util/Components.js';
import {StyleSheets, astHelpers} from '../util/stylesheet.js';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

const create = Components.detect((context, components) => {
  const styleSheets = new StyleSheets();
  const styleReferences = new Set<string>();

  function reportUnusedStyles(unusedStyles: Record<string, AstNode[]>): void {
    Object.keys(unusedStyles).forEach(key => {
      const styles = unusedStyles[key] as AstNode[];
      styles.forEach(node => {
        const message = [
          'Unused style detected: ',
          key,
          '.',
          node.key.name,
        ].join('');

        context.report({message, node});
      });
    });
  }

  return {
    'CallExpression': (node: AstNode) => {
      if (astHelpers.isStyleSheetDeclaration(node, context.settings)) {
        const styleSheetName = astHelpers.getStyleSheetName(node);
        const styles = astHelpers.getStyleDeclarations(node);

        if (styleSheetName) {
          styleSheets.add(styleSheetName, styles);
        }
      }
    },

    'MemberExpression': (node: AstNode) => {
      const styleRef =
        astHelpers.getPotentialStyleReferenceFromMemberExpression(node);
      if (styleRef) {
        styleReferences.add(styleRef);
      }
    },

    'Program:exit': () => {
      const list = components.all();
      if (Object.keys(list).length > 0) {
        styleReferences.forEach(reference => {
          styleSheets.markAsUsed(reference);
        });
        reportUnusedStyles(styleSheets.getUnusedReferences());
      }
    },
  };
});

const rule: Rule.RuleModule = {
  create,
  meta: {
    schema: [],
  },
};

export default rule;
