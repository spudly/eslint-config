/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * StyleSheet collection and AST helpers.
 *
 * ESLint 10 adaptation: the upstream internal helper read source text
 * through the rule context's removed `getSourceCode()` method; it now
 * uses `context.sourceCode.getText(node)`.
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

interface StyleExpression {
  expression: Record<string, unknown>;
  node: AstNode;
}

/**
 * StyleSheets represents the StyleSheets found in the source code.
 */
export class StyleSheets {
  private styleSheets: Record<string, AstNode[]> = {};
  private colorLiterals: StyleExpression[] | undefined;
  private objectExpressions: StyleExpression[] | undefined;

  /**
   * Add adds a StyleSheet to our StyleSheets collections.
   *
   * @param styleSheetName - The name of the StyleSheet.
   * @param properties - The collection of rules in the styleSheet.
   */
  add(styleSheetName: string, properties: AstNode[]): void {
    this.styleSheets[styleSheetName] = properties;
  }

  /**
   * MarkAsUsed marks a rule as used in our source code by removing it
   * from the specified StyleSheet rules.
   *
   * @param fullyQualifiedName - The fully qualified name of the rule,
   *   for example 'styles.text'
   */
  markAsUsed(fullyQualifiedName: string): void {
    const nameSplit = fullyQualifiedName.split('.');
    const styleSheetName = nameSplit[0] as string;
    const styleSheetProperty = nameSplit[1];

    if (this.styleSheets[styleSheetName]) {
      this.styleSheets[styleSheetName] = (
        this.styleSheets[styleSheetName] as AstNode[]
      ).filter(property => property.key.name !== styleSheetProperty);
    }
  }

  /**
   * GetUnusedReferences returns all collected StyleSheets and their
   * unmarked rules.
   */
  getUnusedReferences(): Record<string, AstNode[]> {
    return this.styleSheets;
  }

  /**
   * AddColorLiterals adds an array of expressions that contain color
   * literals to the ColorLiterals collection.
   */
  addColorLiterals(expressions: StyleExpression[]): void {
    if (!this.colorLiterals) {
      this.colorLiterals = [];
    }
    this.colorLiterals = this.colorLiterals.concat(expressions);
  }

  /** GetColorLiterals returns collected color literal expressions. */
  getColorLiterals(): StyleExpression[] | undefined {
    return this.colorLiterals;
  }

  /**
   * AddObjectExpressions adds an array of expressions to the
   * ObjectExpressions collection.
   */
  addObjectExpressions(expressions: StyleExpression[]): void {
    if (!this.objectExpressions) {
      this.objectExpressions = [];
    }
    this.objectExpressions = this.objectExpressions.concat(expressions);
  }

  /** GetObjectExpressions returns collected inline style expressions. */
  getObjectExpressions(): StyleExpression[] | undefined {
    return this.objectExpressions;
  }
}

let currentContent: Rule.RuleContext;
const getSourceCode = (node: AstNode): string =>
  currentContent.sourceCode.getText(node);

const getStyleSheetObjectNames = (
  settings: Record<string, unknown>,
): string[] =>
  (settings['react-native/style-sheet-object-names'] as string[]) || [
    'StyleSheet',
  ];

export const astHelpers = {
  containsStyleSheetObject(node: AstNode, objectNames: string[]): boolean {
    return Boolean(
      node &&
        node.type === 'CallExpression' &&
        node.callee &&
        node.callee.object &&
        node.callee.object.name &&
        objectNames.includes(node.callee.object.name),
    );
  },

  containsCreateCall(node: AstNode): boolean {
    return Boolean(
      node && node.callee && node.callee.property && node.callee.property.name === 'create',
    );
  },

  isStyleSheetDeclaration(
    node: AstNode,
    settings: Record<string, unknown>,
  ): boolean {
    const objectNames = getStyleSheetObjectNames(settings);

    return Boolean(
      astHelpers.containsStyleSheetObject(node, objectNames) &&
        astHelpers.containsCreateCall(node),
    );
  },

  getStyleSheetName(node: AstNode): string | undefined {
    if (node && node.parent && node.parent.id) {
      return node.parent.id.name;
    }
    return undefined;
  },

  getStyleDeclarations(node: AstNode): AstNode[] {
    if (
      node &&
      node.type === 'CallExpression' &&
      node.arguments &&
      node.arguments[0] &&
      node.arguments[0].properties
    ) {
      return node.arguments[0].properties.filter(
        (property: AstNode) => property.type === 'Property',
      );
    }

    return [];
  },

  getStyleDeclarationsChunks(node: AstNode): AstNode[][] {
    if (
      node &&
      node.type === 'CallExpression' &&
      node.arguments &&
      node.arguments[0] &&
      node.arguments[0].properties
    ) {
      const {properties} = node.arguments[0];

      const result: AstNode[][] = [];
      let chunk: AstNode[] = [];
      for (const property of properties) {
        if (property.type === 'Property') {
          chunk.push(property);
        } else if (chunk.length) {
          result.push(chunk);
          chunk = [];
        }
      }
      if (chunk.length) {
        result.push(chunk);
      }
      return result;
    }

    return [];
  },

  getPropertiesChunks(properties: AstNode[]): AstNode[][] {
    const result: AstNode[][] = [];
    let chunk: AstNode[] = [];
    for (const property of properties) {
      if (property.type === 'Property') {
        chunk.push(property);
      } else if (chunk.length) {
        result.push(chunk);
        chunk = [];
      }
    }
    if (chunk.length) {
      result.push(chunk);
    }
    return result;
  },

  getExpressionIdentifier(node: AstNode): string {
    if (node) {
      switch (node.type) {
        case 'Identifier': {
          return node.name;
        }
        case 'Literal': {
          return node.value;
        }
        case 'TemplateLiteral': {
          return node.quasis.reduce(
            (result: string, quasi: AstNode, index: number) =>
              result +
              quasi.value.cooked +
              astHelpers.getExpressionIdentifier(node.expressions[index]),
            '',
          );
        }
        default: {
          return '';
        }
      }
    }

    return '';
  },

  getStylePropertyIdentifier(node: AstNode): string {
    if (node && node.key) {
      return astHelpers.getExpressionIdentifier(node.key);
    }
    return '';
  },

  isStyleAttribute(node: AstNode): boolean {
    return Boolean(
      node.type === 'JSXAttribute' &&
        node.name &&
        node.name.name &&
        node.name.name.toLowerCase().includes('style'),
    );
  },

  collectStyleObjectExpressions(
    node: AstNode,
    context: Rule.RuleContext,
  ): StyleExpression[] {
    currentContent = context;
    if (astHelpers.hasArrayOfStyleReferences(node)) {
      const styleReferenceContainers = node.expression.elements;

      return astHelpers.collectStyleObjectExpressionFromContainers(
        styleReferenceContainers,
      );
    }
    if (node && node.expression) {
      return astHelpers.getStyleObjectExpressionFromNode(node.expression);
    }

    return [];
  },

  collectColorLiterals(
    node: AstNode,
    context: Rule.RuleContext,
  ): StyleExpression[] {
    if (!node) {
      return [];
    }

    currentContent = context;
    if (astHelpers.hasArrayOfStyleReferences(node)) {
      const styleReferenceContainers = node.expression.elements;

      return astHelpers.collectColorLiteralsFromContainers(
        styleReferenceContainers,
      );
    }

    if (node.type === 'ObjectExpression') {
      return astHelpers.getColorLiteralsFromNode(node);
    }

    return astHelpers.getColorLiteralsFromNode(node.expression);
  },

  collectStyleObjectExpressionFromContainers(
    nodes: AstNode[],
  ): StyleExpression[] {
    let objectExpressions: StyleExpression[] = [];
    nodes.forEach(node => {
      objectExpressions = objectExpressions.concat(
        astHelpers.getStyleObjectExpressionFromNode(node),
      );
    });

    return objectExpressions;
  },

  collectColorLiteralsFromContainers(nodes: AstNode[]): StyleExpression[] {
    let colorLiterals: StyleExpression[] = [];
    nodes.forEach(node => {
      colorLiterals = colorLiterals.concat(
        astHelpers.getColorLiteralsFromNode(node),
      );
    });

    return colorLiterals;
  },

  getStyleReferenceFromNode(node: AstNode): string[] {
    if (!node) {
      return [];
    }

    switch (node.type) {
      case 'MemberExpression': {
        const styleReference = astHelpers.getStyleReferenceFromExpression(node);
        return [styleReference];
      }
      case 'LogicalExpression': {
        const leftStyleReferences = astHelpers.getStyleReferenceFromNode(node.left);
        const rightStyleReferences = astHelpers.getStyleReferenceFromNode(node.right);
        return [...leftStyleReferences, ...rightStyleReferences];
      }
      case 'ConditionalExpression': {
        const leftStyleReferences = astHelpers.getStyleReferenceFromNode(node.consequent);
        const rightStyleReferences = astHelpers.getStyleReferenceFromNode(node.alternate);
        return [...leftStyleReferences, ...rightStyleReferences];
      }
      default: {
        return [];
      }
    }
  },

  getStyleObjectExpressionFromNode(node: AstNode): StyleExpression[] {
    if (!node) {
      return [];
    }

    if (node.type === 'ObjectExpression') {
      const result = astHelpers.getStyleObjectFromExpression(node);
      return result ? [result] : [];
    }

    switch (node.type) {
      case 'LogicalExpression': {
        const left = astHelpers.getStyleObjectExpressionFromNode(node.left);
        const right = astHelpers.getStyleObjectExpressionFromNode(node.right);
        return [...left, ...right];
      }
      case 'ConditionalExpression': {
        const left = astHelpers.getStyleObjectExpressionFromNode(node.consequent);
        const right = astHelpers.getStyleObjectExpressionFromNode(node.alternate);
        return [...left, ...right];
      }
      default: {
        return [];
      }
    }
  },

  getColorLiteralsFromNode(node: AstNode): StyleExpression[] {
    if (!node) {
      return [];
    }

    if (node.type === 'ObjectExpression') {
      const result = astHelpers.getColorLiteralsFromExpression(node);
      return result ? [result] : [];
    }

    switch (node.type) {
      case 'LogicalExpression': {
        const left = astHelpers.getColorLiteralsFromNode(node.left);
        const right = astHelpers.getColorLiteralsFromNode(node.right);
        return [...left, ...right];
      }
      case 'ConditionalExpression': {
        const left = astHelpers.getColorLiteralsFromNode(node.consequent);
        const right = astHelpers.getColorLiteralsFromNode(node.alternate);
        return [...left, ...right];
      }
      default: {
        return [];
      }
    }
  },

  hasArrayOfStyleReferences(node: AstNode): boolean {
    return Boolean(
      node &&
        node.type === 'JSXExpressionContainer' &&
        node.expression &&
        node.expression.type === 'ArrayExpression',
    );
  },

  getStyleReferenceFromExpression(node: AstNode): string {
    const result: string[] = [];
    const name = astHelpers.getObjectName(node);
    if (name) {
      result.push(name);
    }

    const property = astHelpers.getPropertyName(node);
    if (property) {
      result.push(property);
    }

    return result.join('.');
  },

  getStyleObjectFromExpression(node: AstNode): StyleExpression | undefined {
    const obj: Record<string, unknown> = {};
    let invalid = false;
    if (node.properties && node.properties.length) {
      node.properties.forEach((p: AstNode) => {
        if (!p.value || !p.key) {
          return;
        }
        if (p.value.type === 'Literal') {
          invalid = true;
          obj[p.key.name] = p.value.value;
        } else if (p.value.type === 'ConditionalExpression') {
          const innerNode = p.value;
          if (
            innerNode.consequent.type === 'Literal' ||
            innerNode.alternate.type === 'Literal'
          ) {
            invalid = true;
            obj[p.key.name] = getSourceCode(innerNode);
          }
        } else if (
          p.value.type === 'UnaryExpression' &&
          p.value.operator === '-' &&
          p.value.argument.type === 'Literal'
        ) {
          invalid = true;
          obj[p.key.name] = -1 * p.value.argument.value;
        } else if (
          p.value.type === 'UnaryExpression' &&
          p.value.operator === '+' &&
          p.value.argument.type === 'Literal'
        ) {
          invalid = true;
          obj[p.key.name] = p.value.argument.value;
        }
      });
    }
    return invalid ? {expression: obj, node} : undefined;
  },

  getColorLiteralsFromExpression(node: AstNode): StyleExpression | undefined {
    const obj: Record<string, unknown> = {};
    let invalid = false;
    if (node.properties && node.properties.length) {
      node.properties.forEach((p: AstNode) => {
        if (p.key && p.key.name && p.key.name.toLowerCase().indexOf('color') !== -1) {
          if (p.value.type === 'Literal') {
            invalid = true;
            obj[p.key.name] = p.value.value;
          } else if (p.value.type === 'ConditionalExpression') {
            const innerNode = p.value;
            if (
              innerNode.consequent.type === 'Literal' ||
              innerNode.alternate.type === 'Literal'
            ) {
              invalid = true;
              obj[p.key.name] = getSourceCode(innerNode);
            }
          }
        }
      });
    }
    return invalid ? {expression: obj, node} : undefined;
  },

  getObjectName(node: AstNode): string | undefined {
    if (node && node.object && node.object.name) {
      return node.object.name;
    }
    return undefined;
  },

  getPropertyName(node: AstNode): string | undefined {
    if (node && node.property && node.property.name) {
      return node.property.name;
    }
    return undefined;
  },

  getPotentialStyleReferenceFromMemberExpression(
    node: AstNode,
  ): string | undefined {
    if (
      node &&
      node.object &&
      node.object.type === 'Identifier' &&
      node.object.name &&
      node.property &&
      node.property.type === 'Identifier' &&
      node.property.name &&
      node.parent.type !== 'MemberExpression'
    ) {
      return [node.object.name, node.property.name].join('.');
    }
    return undefined;
  },

  isEitherShortHand(property1: string, property2: string): boolean {
    const shorthands = ['margin', 'padding', 'border', 'flex'];
    if (shorthands.includes(property1)) {
      return property2.startsWith(property1);
    }
    if (shorthands.includes(property2)) {
      return property1.startsWith(property2);
    }
    return false;
  },
};
