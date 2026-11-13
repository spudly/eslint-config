/**
 * @spudly/commitlint-config — the shared commitlint base for the Spudly
 * repos (issue #49, tranche 2).
 *
 * The base is exactly @commitlint/config-conventional: the conventional
 * type enum, type/scope/subject case and emptiness rules, and the
 * 100-character header limit all come from upstream, so every repo
 * enforces the same commit-message contract.
 *
 * Repo-specific rules stay in each consumer (per the #49 epic): a repo
 * that requires a scope, or restricts scopes to its own list, layers
 * those rules on top of this base in its own commitlint config — for
 * example eciperay's commit-scope rule. Nothing repo-specific belongs
 * here.
 *
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
};
