import type {ESLint} from 'eslint';

/**
 * The `no-source-reads-in-tests` plugin — a TypeScript port of the
 * design-system's local `design-system/no-source-reads-in-tests`
 * rule (`eslintRules/noSourceReadsInTests.mjs` +
 * `noSourceReadsInTestsHelpers.mjs` in spudly/design-system),
 * promoted into this shared package by issue #59 so every repo can
 * consume it instead of the rule living DS-locally. Provenance:
 * design-system #733 (Stephen's decision, 2026-11-20) and #772
 * (the rule itself).
 *
 * Stephen's decision (2026-11-20, on design-system #733): tests
 * that read a source file with `readFileSync` and pin exact source
 * strings protect spelling, not behavior — a refactor that
 * preserves behavior still fails them, and the pins distort
 * implementations. Behavioral contracts convert to prop-capture
 * mock tests; this rule is the guard that stops new source scans
 * from being written.
 *
 * What the rule flags, in a file the config scopes it to (test
 * files): a filesystem read — `readFileSync`, `readFile`,
 * `existsSync`, `createReadStream`, or a directory enumeration via
 * `readdirSync` — whose target statically resolves to a JS/TS
 * source file or a source directory:
 *
 * 1. Any string fragment of the target path ends in a source
 *    extension (.ts/.tsx/.js/.jsx/.mts/.cts/.mjs/.cjs), including
 *    template fragments like `${name}.tsx` and `join(...)` segment
 *    lists — UNLESS the target is a declaration file (.d.ts) or
 *    lives under a `dist/` directory: built-output checks are
 *    legitimate.
 * 2. The target is built from a variable assigned the result of
 *    `readdirSync` over a source directory (the enumerate-then-read
 *    pattern), or is itself a `readdirSync` over a directory under
 *    `src/`.
 *
 * Reads of data files (.json, .md, .css, .html, package.json) and
 * dist output are NOT flagged.
 *
 * The one deliberate adaptation in the port: the report messages
 * are worded repo-neutrally and carry no issue references or repo
 * layout — this package bakes in no repo's layout. The messageIds
 * and the static path analysis are carried over exactly.
 *
 * Wiring: folded into the shared `jest` export (see
 * `src/jest.ts`), scoped to test files at 'warn'.
 */

// AST nodes are handled structurally in the ported code, so this
// alias is intentionally `any` (same as the other local ports).
type AstNode = any;

type Variables = Map<string, AstNode>;

const READ_FUNCTIONS = new Set([
  'readFileSync',
  'readFile',
  'existsSync',
  'createReadStream',
  'readdirSync',
]);

const SOURCE_EXTENSION = /\.(?:ts|tsx|js|jsx|mts|cts|mjs|cjs)$/u;
const SOURCE_TEMPLATE_TAIL = /\.(?:ts|tsx|js|jsx|mts|cts|mjs|cjs)$/u;

function calleeName(callee: AstNode): string | undefined {
  if (callee.type === 'Identifier') return callee.name as string;
  if (
    callee.type === 'MemberExpression' &&
    callee.property.type === 'Identifier'
  ) {
    return callee.property.name as string;
  }
  return undefined;
}

/** All statically known string fragments inside an expression. */
function stringFragments(
  node: AstNode,
  variables: Variables,
  depth = 0,
): string[] {
  if (!node || depth > 6) return [];
  switch (node.type) {
    case 'Literal': {
      return typeof node.value === 'string' ? [node.value as string] : [];
    }
    case 'TemplateLiteral': {
      return (node.quasis as AstNode[])
        .map(quasi => (quasi.value.cooked ?? '') as string)
        .filter(Boolean);
    }
    case 'BinaryExpression': {
      return [
        ...stringFragments(node.left, variables, depth + 1),
        ...stringFragments(node.right, variables, depth + 1),
      ];
    }
    case 'CallExpression': {
      return (node.arguments as AstNode[]).flatMap(arg =>
        stringFragments(arg, variables, depth + 1),
      );
    }
    case 'Identifier': {
      const init = variables.get(node.name as string);
      return init ? stringFragments(init, variables, depth + 1) : [];
    }
    case 'MemberExpression': {
      return stringFragments(node.object, variables, depth + 1);
    }
    case 'ArrayExpression': {
      return (node.elements as AstNode[]).flatMap(el =>
        stringFragments(el, variables, depth + 1),
      );
    }
    case 'ObjectExpression': {
      return (node.properties as AstNode[]).flatMap(prop =>
        stringFragments(
          prop.type === 'Property' ? prop.value : prop,
          variables,
          depth + 1,
        ),
      );
    }
    case 'SpreadElement': {
      return stringFragments(node.argument, variables, depth + 1);
    }
    default: {
      return [];
    }
  }
}

/** Whether an expression is (or is built from) a readdirSync result. */
function derivesFromReaddir(
  node: AstNode,
  variables: Variables,
  enumeratorHelpers: Set<string>,
  depth = 0,
): boolean {
  if (!node || depth > 6) return false;
  if (node.type === 'CallExpression') {
    if (calleeName(node.callee) === 'readdirSync') return true;
    if (
      node.callee.type === 'Identifier' &&
      enumeratorHelpers.has(node.callee.name as string)
    ) {
      return true;
    }
    return (node.arguments as AstNode[]).some(arg =>
      derivesFromReaddir(arg, variables, enumeratorHelpers, depth + 1),
    );
  }
  if (node.type === 'Identifier') {
    const init = variables.get(node.name as string);
    return init
      ? derivesFromReaddir(init, variables, enumeratorHelpers, depth + 1)
      : false;
  }
  if (node.type === 'MemberExpression') {
    return derivesFromReaddir(
      node.object,
      variables,
      enumeratorHelpers,
      depth + 1,
    );
  }
  return false;
}

function isLegitTarget(fragments: string[]): boolean {
  return fragments.some(
    fragment =>
      fragment.endsWith('.d.ts') ||
      fragment === 'dist' ||
      fragment.includes('/dist/') ||
      fragment.startsWith('dist/'),
  );
}

function isSourceTarget(fragments: string[]): boolean {
  return fragments.some(
    fragment =>
      SOURCE_EXTENSION.test(fragment) ||
      SOURCE_TEMPLATE_TAIL.test(fragment.trim()),
  );
}

function sourceFragmentOf(fragments: string[]): string | undefined {
  return fragments.find(fragment => SOURCE_EXTENSION.test(fragment));
}

function isSourceDirectory(fragments: string[]): boolean {
  return fragments.some(
    fragment =>
      fragment === 'src' ||
      fragment.endsWith('/src') ||
      fragment.startsWith('src/'),
  );
}

/** Every identifier name appearing anywhere under a node. */
function identifiersIn(
  node: AstNode,
  out = new Set<string>(),
  depth = 0,
): Set<string> {
  if (!node || typeof node !== 'object' || depth > 8) return out;
  if (node.type === 'Identifier') out.add(node.name as string);
  for (const key of Object.keys(node as Record<string, unknown>)) {
    if (key === 'parent') continue;
    const value = (node as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      for (const child of value) identifiersIn(child, out, depth + 1);
    } else if (value && typeof value === 'object' && (value as AstNode).type) {
      identifiersIn(value, out, depth + 1);
    }
  }
  return out;
}

type FunctionFrame = {
  name: string | undefined;
  params: string[];
};

const enumeratorHelpers = new Set<string>();

const noSourceReadsInTestsPlugin: ESLint.Plugin = {
  rules: {
    'no-source-reads-in-tests': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Test files must not read JS/TS source files: source-string pins protect spelling, not behavior. Convert the assertion to a behavioral or prop-capture test instead.',
        },
        messages: {
          sourceRead:
            "Tests must not read source files ('{{target}}'). Source-string pins protect spelling, not behavior — assert the behavior (rendering or prop-capture) instead.",
          dynamicSourceRead:
            'Tests must not read source files through a directory enumeration. Source-string pins protect spelling, not behavior — assert the behavior (rendering or prop-capture) instead.',
        },
        schema: [],
      },
      create(context) {
        enumeratorHelpers.clear();
        const variables: Variables = new Map();
        const helpers = new Map<string, number>();
        const functionStack: FunctionFrame[] = [];
        function registerHelper(paramName: string) {
          const fn = functionStack.at(-1);
          if (!fn?.name) return;
          const index = fn.params.indexOf(paramName);
          if (index !== -1) helpers.set(fn.name, index);
        }
        function pushFunction(node: AstNode, name?: string) {
          functionStack.push({
            name: name ?? (node.id?.name as string | undefined),
            params: (node.params as AstNode[])
              .filter(p => p.type === 'Identifier')
              .map(p => p.name as string),
          });
        }
        return {
          'FunctionDeclaration'(node: AstNode) {
            pushFunction(node);
          },
          'FunctionDeclaration:exit'() {
            functionStack.pop();
          },
          'FunctionExpression'(node: AstNode) {
            pushFunction(node);
          },
          'FunctionExpression:exit'() {
            functionStack.pop();
          },
          'ArrowFunctionExpression'(node: AstNode) {
            const parent = node.parent as AstNode;
            const name =
              parent?.type === 'VariableDeclarator' &&
              parent.id.type === 'Identifier'
                ? (parent.id.name as string)
                : undefined;
            pushFunction(node, name);
          },
          'ArrowFunctionExpression:exit'() {
            functionStack.pop();
          },
          'VariableDeclarator'(node: AstNode) {
            if (
              node.id.type === 'ArrayPattern' ||
              node.id.type === 'ObjectPattern'
            ) {
              const init =
                node.init ??
                (node.parent?.parent &&
                (node.parent.parent.type === 'ForOfStatement' ||
                  node.parent.parent.type === 'ForInStatement')
                  ? node.parent.parent.right
                  : undefined);
              if (init) {
                const elements =
                  node.id.type === 'ArrayPattern'
                    ? (node.id.elements as AstNode[])
                    : (node.id.properties as AstNode[]);
                for (const element of elements) {
                  const target =
                    element?.type === 'RestElement'
                      ? element.argument
                      : element;
                  const nameNode =
                    target?.type === 'Property' ? target.value : target;
                  if (nameNode?.type === 'Identifier') {
                    variables.set(nameNode.name as string, init);
                  }
                }
              }
              return;
            }
            if (node.id.type !== 'Identifier') return;
            if (node.init) {
              variables.set(node.id.name as string, node.init);
            } else if (
              node.parent?.parent &&
              (node.parent.parent.type === 'ForOfStatement' ||
                node.parent.parent.type === 'ForInStatement')
            ) {
              variables.set(node.id.name as string, node.parent.parent.right);
            }
          },
          'CallExpression'(node: AstNode) {
            const name = calleeName(node.callee);
            if (!name) return;
            if (!READ_FUNCTIONS.has(name)) {
              const paramIndex = helpers.get(name);
              if (paramIndex === undefined) return;
              const arg = (node.arguments as AstNode[])[paramIndex];
              if (!arg) return;
              const fragments = stringFragments(arg, variables);
              if (!isLegitTarget(fragments) && isSourceTarget(fragments)) {
                context.report({node, messageId: 'dynamicSourceRead'});
              }
              return;
            }
            const target = (node.arguments as AstNode[])[0];
            if (!target) return;
            const fn = functionStack.at(-1);
            if (fn) {
              for (const id of identifiersIn(target)) {
                if (fn.params.includes(id)) registerHelper(id);
              }
            }
            const fragments = stringFragments(target, variables);
            if (isLegitTarget(fragments)) return;
            if (isSourceTarget(fragments)) {
              const sourceFragment = sourceFragmentOf(fragments);
              context.report({
                node,
                messageId: 'sourceRead',
                data: {target: sourceFragment ?? name},
              });
              return;
            }
            if (name === 'readdirSync') {
              if (isSourceDirectory(fragments)) {
                context.report({node, messageId: 'dynamicSourceRead'});
              }
              const currentFn = functionStack.at(-1);
              if (currentFn?.name) enumeratorHelpers.add(currentFn.name);
              return;
            }
            if (
              derivesFromReaddir(target, variables, enumeratorHelpers) ||
              derivesFromReaddir(node, variables, enumeratorHelpers)
            ) {
              context.report({node, messageId: 'dynamicSourceRead'});
            }
          },
        };
      },
    },
  },
};

export default noSourceReadsInTestsPlugin;
