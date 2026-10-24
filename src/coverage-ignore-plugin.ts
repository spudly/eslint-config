import type {AST, ESLint} from 'eslint';

/**
 * The `coverage-ignore` plugin — ported verbatim from Eciperay's
 * eslint-rules/coverage-ignore-require-description.ts (section 10 of
 * its eslint.config.ts). Stephen directed (2026-10-24) that Eciperay's
 * custom rules live in this shared package rather than staying local.
 *
 * Fully generic: reports any `istanbul ignore` / `c8 ignore` comment
 * that lacks a `-- description`, in any file the consumer applies it
 * to.
 */
const coverageIgnorePlugin: ESLint.Plugin = {
  rules: {
    'require-description': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require a `-- reason` on istanbul and c8 coverage-ignore comments',
        },
        messages: {
          missing:
            'Coverage ignore comment must include a description after `--`',
        },
        schema: [],
      },
      create(context) {
        return {
          Program(node: AST.Program) {
            for (const comment of node.comments ?? []) {
              const value = comment.value.trim();
              if (
                /^(?:istanbul|c8)\s+ignore\b/.test(value) &&
                !value.includes('--') &&
                comment.loc
              ) {
                context.report({loc: comment.loc, messageId: 'missing'});
              }
            }
          },
        };
      },
    },
  },
};

export default coverageIgnorePlugin;
