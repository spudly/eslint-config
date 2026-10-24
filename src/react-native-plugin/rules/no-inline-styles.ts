/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Detects inline styles
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

  function reportInlineStyles(
    inlineStyles: {expression: unknown; node: AstNode}[] | undefined,
  ): void {
    if (inlineStyles) {
      inlineStyles.forEach(style => {
        if (style) {
          const expression = inspect(style.expression);
          context.report({
            data: {expression},
            message: 'Inline style: {{expression}}',
            node: style.node,
          });
        }
      });
    }
  }

  return {
    JSXAttribute: (node: AstNode) => {
      if (astHelpers.isStyleAttribute(node)) {
        const styles = astHelpers.collectStyleObjectExpressions(
          node.value,
          context,
        );
        styleSheets.addObjectExpressions(styles);
      }
    },

    'Program:exit': () =>
      reportInlineStyles(styleSheets.getObjectExpressions()),
  };
});

const rule: Rule.RuleModule = {
  create,
  meta: {
    schema: [],
  },
};

export default rule;
