import type {AST, ESLint} from 'eslint';

/**
 * The `spudly-ui` plugin — ported from Eciperay's
 * eslint-rules/no-classname-outside-components.ts (section 10a of its
 * eslint.config.ts), where the plugin was registered under the
 * Eciperay-specific `eciperay-ui` namespace. Stephen directed
 * (2026-10-24) that Eciperay's custom rules live in this shared
 * package, so the namespace is the generic `spudly-ui` here;
 * Eciperay's adoption PR renames its side accordingly.
 *
 * Generalization from the original: the rule no longer gates itself
 * to Eciperay's `packages/app` / `packages/web` layout — which files
 * it applies to is the config export's `files` glob, as with every
 * other piece of this package. A file is "allowed" (className is
 * legitimate there) when its path contains the configured allowed
 * segment — `src/components` by default, matching the original's
 * `/packages/(app|web)/src/components/` check for any package layout —
 * or when a consumer overrides it via the `allowedSegment` rule
 * option. Test files (`*.test.tsx`) stay exempt, as in the original.
 */
const normalizePath = (filename: string) => filename.replace(/\\/g, '/');

const noClassnameOutsideComponentsPlugin: ESLint.Plugin = {
  rules: {
    'no-classname-outside-components': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow className outside the components directory (src/components by default) — extract styling to reusable components',
        },
        messages: {
          forbidden:
            'className must only be used inside {{allowedSegment}}/. Extract a reusable component instead.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              allowedSegment: {type: 'string'},
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const [options] = context.options as [{allowedSegment?: string}?];
        const allowedSegment = (
          options?.allowedSegment ?? 'src/components'
        ).replace(/^\/+|\/+$/g, '');
        const filename = normalizePath(context.filename);

        if (
          filename.includes(`/${allowedSegment}/`) ||
          filename.startsWith(`${allowedSegment}/`) ||
          filename.endsWith('.test.tsx')
        ) {
          return {};
        }

        return {
          JSXAttribute(node: {
            name: {type: string; name?: string};
            loc?: AST.SourceLocation | null;
          }) {
            if (
              node.name.type === 'JSXIdentifier' &&
              node.name.name === 'className' &&
              node.loc
            ) {
              context.report({
                loc: node.loc,
                messageId: 'forbidden',
                data: {allowedSegment},
              });
            }
          },
        };
      },
    },
  },
};

export default noClassnameOutsideComponentsPlugin;
