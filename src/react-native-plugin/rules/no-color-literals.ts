/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Detects color literals
 * @author Aaron Greenwald
 */
import {inspect} from 'node:util';
import type {Rule} from 'eslint';

import {Components} from '../util/Components.js';
import {StyleSheets, astHelpers} from '../util/stylesheet.js';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

const create = Components.detect(context => {
  const styleSheets = new StyleSheets();

  function reportColorLiterals(
    colorLiterals: {expression: unknown; node: AstNode}[] | undefined,
  ): void {
    if (colorLiterals) {
      colorLiterals.forEach(style => {
        if (style) {
          const expression = inspect(style.expression);
          context.report({
            data: {expression},
            message: 'Color literal: {{expression}}',
            node: style.node,
          });
        }
      });
    }
  }

  return {
    CallExpression: (node: AstNode) => {
      if (astHelpers.isStyleSheetDeclaration(node, context.settings)) {
        const styles = astHelpers.getStyleDeclarations(node);

        if (styles) {
          styles.forEach(style => {
            const literals = astHelpers.collectColorLiterals(
              style.value,
              context,
            );
            styleSheets.addColorLiterals(literals);
          });
        }
      }
    },

    JSXAttribute: (node: AstNode) => {
      if (astHelpers.isStyleAttribute(node)) {
        const literals = astHelpers.collectColorLiterals(node.value, context);
        styleSheets.addColorLiterals(literals);
      }
    },

    'Program:exit': () => reportColorLiterals(styleSheets.getColorLiterals()),
  };
});

const rule: Rule.RuleModule = {
  create,
  meta: {
    schema: [],
  },
};

export default rule;
