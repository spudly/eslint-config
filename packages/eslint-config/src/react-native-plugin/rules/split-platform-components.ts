/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * @fileoverview Android and IOS components should be
 * used in platform specific React Native components.
 * @author Tom Hastjarjanto
 *
 * ESLint 10 adaptation: `context.getFilename()` became
 * `context.filename`.
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

interface SplitPlatformOptions {
  androidPathRegex?: string;
  iosPathRegex?: string;
}

const rule: Rule.RuleModule = {
  create(context) {
    let reactComponents: AstNode[] = [];
    const androidMessage =
      'Android components should be placed in android files';
    const iosMessage = 'IOS components should be placed in ios files';
    const conflictMessage = "IOS and Android components can't be mixed";
    const options = context.options[0] as SplitPlatformOptions | undefined;
    const iosPathRegex =
      options && options.iosPathRegex
        ? new RegExp(options.iosPathRegex)
        : /\.ios\.[j|t]sx?$/;
    const androidPathRegex =
      options && options.androidPathRegex
        ? new RegExp(options.androidPathRegex)
        : /\.android\.[j|t]sx?$/;

    function getName(node: AstNode): string | undefined {
      if (node.type === 'Property') {
        const key = node.key || node.argument;
        return key.type === 'Identifier' ? key.name : key.value;
      }
      if (node.type === 'Identifier') {
        return node.name;
      }
      return undefined;
    }

    function hasNodeWithName(nodes: AstNode[], name: string): boolean {
      return nodes.some(node => {
        const nodeName = getName(node);
        return nodeName && nodeName.includes(name);
      });
    }

    function reportErrors(components: AstNode[], filename: string): void {
      const containsAndroidAndIOS =
        hasNodeWithName(components, 'IOS') &&
        hasNodeWithName(components, 'Android');

      components.forEach(node => {
        const propName = getName(node) as string;

        if (propName.includes('IOS') && !filename.match(iosPathRegex)) {
          context.report({
            message: containsAndroidAndIOS ? conflictMessage : iosMessage,
            node,
          });
        }

        if (propName.includes('Android') && !filename.match(androidPathRegex)) {
          context.report({
            message: containsAndroidAndIOS ? conflictMessage : androidMessage,
            node,
          });
        }
      });
    }

    return {
      'ImportDeclaration'(node: AstNode) {
        if (node.source.value === 'react-native') {
          node.specifiers.forEach((importSpecifier: AstNode) => {
            if (importSpecifier.type === 'ImportSpecifier') {
              reactComponents = reactComponents.concat(
                importSpecifier.imported,
              );
            }
          });
        }
      },
      'Program:exit'() {
        const filename = context.filename;
        reportErrors(reactComponents, filename);
      },
      'VariableDeclarator'(node: AstNode) {
        const destructuring =
          node.init && node.id && node.id.type === 'ObjectPattern';
        const statelessDestructuring =
          destructuring && node.init.name === 'React';
        if (destructuring && statelessDestructuring) {
          reactComponents = reactComponents.concat(node.id.properties);
        }
      },
    };
  },
  meta: {
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          androidPathRegex: {
            type: 'string',
          },
          iosPathRegex: {
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
  },
};

export default rule;
