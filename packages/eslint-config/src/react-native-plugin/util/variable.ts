/**
 * Vendored from eslint-plugin-react-native 5.0.0 (MIT) — see NOTICE.
 *
 * Utility functions for React component detection.
 *
 * @author Yannick Croissant
 *
 * ESLint 10 adaptation: the upstream code resolved scopes through
 * `(context.sourceCode || context).getScope(node)` with a fallback to the
 * removed `context.getScope()`. Only `context.sourceCode.getScope(node)`
 * remains (that API has existed since ESLint 8.40).
 */
import type {Rule, Scope} from 'eslint';

// AST nodes are handled structurally in the vendored code, so this
// alias is intentionally `any` (same as the untyped upstream source).
type AstNode = any;

/**
 * Record that a particular variable has been used in code
 *
 * @param name The name of the variable to mark as used.
 * @returns True if the variable was found and marked as used, false if not.
 */
export function markVariableAsUsed(
  context: Rule.RuleContext,
  name: string,
  node: AstNode,
): boolean {
  let scope: Scope.Scope | null = context.sourceCode.getScope(node);
  let found = false;

  // Special Node.js scope means we need to start one level deeper
  if (scope.type === 'global') {
    while (scope.childScopes.length) {
      [scope] = scope.childScopes as [Scope.Scope];
    }
  }

  while (scope) {
    for (const variable of scope.variables) {
      if (variable.name === name) {
        (variable as {eslintUsed?: boolean}).eslintUsed = true;
        found = true;
      }
    }
    scope = scope.upper;
  }

  return found;
}

/** Search a particular variable in a list. */
export function findVariable(
  variables: Scope.Variable[],
  name: string,
): boolean {
  for (const variable of variables) {
    if (variable.name === name) {
      return true;
    }
  }

  return false;
}

export function getScope(
  context: Rule.RuleContext,
  node: AstNode,
): Scope.Scope {
  return context.sourceCode.getScope(node);
}

/** List all variables in a given scope. */
export function variablesInScope(
  context: Rule.RuleContext,
  node: AstNode,
): Scope.Variable[] {
  let scope = getScope(context, node);
  let {variables} = scope;

  while (scope.type !== 'global') {
    scope = scope.upper as Scope.Scope;
    variables = scope.variables.concat(variables);
  }
  if (scope.childScopes.length) {
    variables = (scope.childScopes[0] as Scope.Scope).variables.concat(
      variables,
    );
    if ((scope.childScopes[0] as Scope.Scope).childScopes.length) {
      variables = (
        (scope.childScopes[0] as Scope.Scope).childScopes[0] as Scope.Scope
      ).variables.concat(variables);
    }
  }

  return variables;
}
