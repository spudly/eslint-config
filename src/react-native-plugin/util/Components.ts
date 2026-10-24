/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * Utility class and functions for React component detection.
 *
 * @author Yannick Croissant
 *
 * ESLint 10 adaptations: `context.getSourceCode()` became
 * `context.sourceCode`, and `(context.sourceCode || context).getScope(n)`
 * became `context.sourceCode.getScope(n)` (the `context.getScope()`
 * fallback was removed in ESLint 9). The prototype-based class was
 * ported to a TypeScript class with identical behavior.
 */
import type {Rule} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

interface ComponentEntry {
  confidence: number;
  node: AstNode;
  [key: string]: unknown;
}

export type ComponentRule = (
  context: Rule.RuleContext,
  components: Components,
  utils: Record<string, (node: AstNode) => AstNode | boolean | null>,
) => Rule.RuleListener;

/** Components */
export class Components {
  private list: Record<string, ComponentEntry> = {};

  private getId(node: AstNode): string {
    return node && node.range.join(':');
  }

  /**
   * Add a node to the components list, or update it if it's already in
   * the list.
   *
   * @param node The AST node being added.
   * @param confidence Confidence in the component detection (0=banned,
   *   1=maybe, 2=yes)
   */
  add(node: AstNode, confidence: number): void {
    const id = this.getId(node);
    if (this.list[id]) {
      if (confidence === 0 || (this.list[id] as ComponentEntry).confidence === 0) {
        (this.list[id] as ComponentEntry).confidence = 0;
      } else {
        (this.list[id] as ComponentEntry).confidence = Math.max(
          (this.list[id] as ComponentEntry).confidence,
          confidence,
        );
      }
      return;
    }
    this.list[id] = {confidence, node};
  }

  /** Find a component in the list using its node. */
  get(node: AstNode): ComponentEntry | undefined {
    const id = this.getId(node);
    return this.list[id];
  }

  /** Update a component in the list. */
  set(node: AstNode, props: Record<string, unknown>): void {
    let currentNode = node;
    while (currentNode && !this.list[this.getId(currentNode)]) {
      currentNode = node.parent;
    }
    if (!currentNode) {
      return;
    }
    const id = this.getId(currentNode);
    this.list[id] = {...(this.list[id] as ComponentEntry), ...props};
  }

  /**
   * Return the components list. Components for which we are not
   * confident are not returned.
   */
  all(): Record<string, ComponentEntry> {
    const list: Record<string, ComponentEntry> = {};
    for (const i of Object.keys(this.list)) {
      if ((this.list[i] as ComponentEntry).confidence >= 2) {
        list[i] = this.list[i] as ComponentEntry;
      }
    }
    return list;
  }

  /**
   * Return the length of the components list. Components for which we
   * are not confident are not counted.
   */
  length(): number {
    let length = 0;
    for (const i of Object.keys(this.list)) {
      if ((this.list[i] as ComponentEntry).confidence >= 2) {
        length += 1;
      }
    }
    return length;
  }

  /**
   * Wrap a rule so component detection instructions run alongside the
   * rule's own visitors (upstream: `Components.detect(rule)`).
   */
  static detect(
    rule: ComponentRule,
  ): (context: Rule.RuleContext) => Rule.RuleListener {
    return (context: Rule.RuleContext) => componentRule(rule, context);
  }
}

function componentRule(
  rule: ComponentRule,
  context: Rule.RuleContext,
): Rule.RuleListener {
  const sourceCode = context.sourceCode;
  const components = new Components();

  // Utilities for component detection
  const utils = {
    /** Check if the node is a React ES5 component. */
    isES5Component(node: AstNode): boolean {
      if (!node.parent) {
        return false;
      }
      return /^(React\.)?createClass$/.test(
        sourceCode.getText(node.parent.callee),
      );
    },

    /** Check if the node is a React ES6 component. */
    isES6Component(node: AstNode): boolean {
      if (!node.superClass) {
        return false;
      }
      return /^(React\.)?(Pure)?Component$/.test(
        sourceCode.getText(node.superClass),
      );
    },

    /** Check if the node is returning JSX. */
    isReturningJSX(node: AstNode): boolean {
      let property: string;
      switch (node.type) {
        case 'ReturnStatement': {
          property = 'argument';
          break;
        }
        case 'ArrowFunctionExpression': {
          property = 'body';
          break;
        }
        default: {
          return false;
        }
      }

      const returnsJSX =
        node[property] &&
        (node[property].type === 'JSXElement' ||
          node[property].type === 'JSXFragment');
      const returnsReactCreateElement =
        node[property] &&
        node[property].callee &&
        node[property].callee.property &&
        node[property].callee.property.name === 'createElement';
      return Boolean(returnsJSX || returnsReactCreateElement);
    },

    /** Get the parent component node from the current scope. */
    getParentComponent(node: AstNode): AstNode {
      return (
        utils.getParentES6Component(node) ||
        utils.getParentES5Component(node) ||
        utils.getParentStatelessComponent(node)
      );
    },

    /** Get the parent ES5 component node from the current scope. */
    getParentES5Component(node: AstNode): AstNode {
      let scope: ReturnType<typeof sourceCode.getScope> | null =
        sourceCode.getScope(node);
      while (scope) {
        const block = scope.block as unknown as AstNode;
        const componentNode = block && block.parent && block.parent.parent;
        if (componentNode && utils.isES5Component(componentNode)) {
          return componentNode;
        }
        scope = scope.upper;
      }
      return null;
    },

    /** Get the parent ES6 component node from the current scope. */
    getParentES6Component(node: AstNode): AstNode {
      let scope: ReturnType<typeof sourceCode.getScope> | null =
        sourceCode.getScope(node);
      while (scope && scope.type !== 'class') {
        scope = scope.upper;
      }
      const componentNode = scope && (scope.block as unknown as AstNode);
      if (!componentNode || !utils.isES6Component(componentNode)) {
        return null;
      }
      return componentNode;
    },

    /** Get the parent stateless component node from the current scope. */
    getParentStatelessComponent(node: AstNode): AstNode {
      let scope: ReturnType<typeof sourceCode.getScope> | null =
        sourceCode.getScope(node);
      while (scope) {
        const componentNode = scope.block as unknown as AstNode;
        // Ignore non functions
        const isFunction = /Function/.test(componentNode.type);
        // Ignore classes methods
        const isNotMethod =
          !componentNode.parent || componentNode.parent.type !== 'MethodDefinition';
        // Ignore arguments (callback, etc.)
        const isNotArgument =
          !componentNode.parent || componentNode.parent.type !== 'CallExpression';
        if (isFunction && isNotMethod && isNotArgument) {
          return componentNode;
        }
        scope = scope.upper;
      }
      return null;
    },

    /** Get the related component from a node. */
    getRelatedComponent(node: AstNode): ComponentEntry | null | undefined {
      let currentNode: AstNode = node;
      // Get the component path
      const componentPath: string[] = [];
      while (currentNode) {
        if (currentNode.property && currentNode.property.type === 'Identifier') {
          componentPath.push(currentNode.property.name);
        }
        if (currentNode.object && currentNode.object.type === 'Identifier') {
          componentPath.push(currentNode.object.name);
        }
        currentNode = currentNode.object;
      }
      componentPath.reverse();

      // Find the variable in the current scope
      const variableName = componentPath.shift();
      if (!variableName) {
        return null;
      }
      let variableInScope;
      const {variables} = sourceCode.getScope(node);
      for (const variable of variables) {
        if (variable.name === variableName) {
          variableInScope = variable;
          break;
        }
      }
      if (!variableInScope) {
        return null;
      }

      // Find the variable declaration
      let defInScope;
      const {defs} = variableInScope;
      for (const def of defs) {
        if (
          def.type === 'ClassName' ||
          def.type === 'FunctionName' ||
          def.type === 'Variable'
        ) {
          defInScope = def;
          break;
        }
      }
      if (!defInScope) {
        return null;
      }
      currentNode =
        (defInScope.node as unknown as AstNode).init || defInScope.node;

      // Traverse the node properties to the component declaration
      for (const pathPart of componentPath) {
        if (!currentNode.properties) {
          continue;
        }
        for (const property of currentNode.properties) {
          if (property.key.name === pathPart) {
            currentNode = property;
            break;
          }
        }
        if (!currentNode) {
          return null;
        }
        currentNode = currentNode.value;
      }

      // Return the component
      return components.get(currentNode);
    },
  };

  // Component detection instructions
  const detectionInstructions: Rule.RuleListener = {
    ClassDeclaration(node: AstNode) {
      if (!utils.isES6Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    ClassProperty(node: AstNode) {
      const componentNode = utils.getParentComponent(node);
      if (!componentNode) {
        return;
      }
      components.add(componentNode, 2);
    },

    ObjectExpression(node: AstNode) {
      if (!utils.isES5Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    FunctionExpression(node: AstNode) {
      const componentNode = utils.getParentComponent(node);
      if (!componentNode) {
        return;
      }
      components.add(componentNode, 1);
    },

    FunctionDeclaration(node: AstNode) {
      const componentNode = utils.getParentComponent(node);
      if (!componentNode) {
        return;
      }
      components.add(componentNode, 1);
    },

    ArrowFunctionExpression(node: AstNode) {
      const componentNode = utils.getParentComponent(node);
      if (!componentNode) {
        return;
      }
      if (componentNode.expression && utils.isReturningJSX(componentNode)) {
        components.add(componentNode, 2);
      } else {
        components.add(componentNode, 1);
      }
    },

    ThisExpression(node: AstNode) {
      const componentNode = utils.getParentComponent(node);
      if (!componentNode || !/Function/.test(componentNode.type)) {
        return;
      }
      // Ban functions with a ThisExpression
      components.add(componentNode, 0);
    },

    ReturnStatement(node: AstNode) {
      if (!utils.isReturningJSX(node)) {
        return;
      }
      const parentNode = utils.getParentComponent(node);
      if (!parentNode) {
        return;
      }
      components.add(parentNode, 2);
    },
  };

  // Update the provided rule instructions to add the component detection
  const ruleInstructions = rule(
    context,
    components,
    utils as Record<string, (node: AstNode) => AstNode | boolean | null>,
  );
  const updatedRuleInstructions: Rule.RuleListener = {...ruleInstructions};
  for (const instruction of Object.keys(detectionInstructions)) {
    const detection = detectionInstructions[instruction];
    const original = ruleInstructions[instruction];
    updatedRuleInstructions[instruction] = (node: AstNode) => {
      if (detection) {
        (detection as (n: AstNode) => void)(node);
      }
      return original ? (original as (n: AstNode) => void)(node) : undefined;
    };
  }
  // Return the updated rule instructions
  return updatedRuleInstructions;
}
