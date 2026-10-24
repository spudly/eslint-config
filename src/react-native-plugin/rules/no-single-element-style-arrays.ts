/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Enforce no single element style arrays
 * @author Michael Gall
 *
 * ESLint 10 adaptation: `context.getSourceCode()` became
 * `context.sourceCode`.
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

const rule: Rule.RuleModule = {
  create(context) {
    function reportNode(jsxExpressionNode: AstNode): void {
      context.report({
        fix(fixer) {
          const realStyleNode = jsxExpressionNode.value.expression.elements[0];
          const styleSource = context.sourceCode.getText(realStyleNode);
          return fixer.replaceText(jsxExpressionNode.value.expression, styleSource);
        },
        message:
          'Single element style arrays are not necessary and cause unnecessary re-renders',
        node: jsxExpressionNode,
      });
    }

    return {
      JSXAttribute(node: AstNode) {
        if (node.name.name !== 'style') return;
        if (!node.value.expression) return;
        if (node.value.expression.type !== 'ArrayExpression') return;
        if (node.value.expression.elements.length === 1) {
          reportNode(node);
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Disallow single element style arrays. These cause unnecessary re-renders as the identity of the array always changes',
      recommended: false,
      url: '',
    },
    fixable: 'code',
  },
};

export default rule;
