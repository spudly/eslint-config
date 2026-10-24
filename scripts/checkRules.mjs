#!/usr/bin/env node
/**
 * check-rules — config-currency audit for @spudly/eslint-config (issue #2).
 *
 * Stephen's policy: this config stays complete and current as ESLint and
 * its plugins evolve. Every rule available in the installed ESLint core
 * and in every plugin this package composes gets an explicit entry
 * somewhere in the package; deprecated/removed entries do not linger.
 *
 * The issue names eslint-find-rules as the intended engine, but
 * eslint-find-rules 5.0.0 (latest, Jan 2025) declares peer
 * `eslint: ^8.57.1 || ^9.18.0` — it cannot run under this repo's
 * ESLint 10. Per the issue's own allowance ("or an equivalent tool if
 * research shows a better fit for flat config / ESLint 10"), this script
 * is that equivalent: it enumerates the rules of the *built* composed
 * config directly from ESLint 10's own metadata —
 *
 *   - available core rules + their deprecation flags come from
 *     `builtinRules` in `eslint/use-at-your-own-risk`;
 *   - available plugin rules come from the plugin objects the config
 *     itself registers in its flat-config blocks (so the audit always
 *     matches the exact plugin versions the config composes);
 *   - configured rules are the union of `rules` across every export.
 *
 * Report categories (exit 1 when any is non-empty):
 *   1. DEPRECATED — configured rules whose installed version marks
 *      them deprecated. Policy: remove them from the config.
 *   2. REMOVED / UNKNOWN — configured rules that no longer exist in
 *      core or in any registered plugin. Policy: remove them.
 *   3. MISSING — available rules (core or registered plugin) with no
 *      explicit entry anywhere in the package. Policy: add an explicit
 *      entry; 'off' is allowed only with a rationale comment.
 *
 * Scope notes:
 *   - A rule id whose plugin prefix is never registered by any export
 *     cannot be verified and is skipped in categories 1–2. The composed
 *     config carries such ids only as defensive 'off' entries for
 *     uninstalled plugins (e.g. the @typescript-eslint pending state).
 *   - The eslint-config-prettier block inside `base` is upstream-owned:
 *     its entire purpose is switching stylistic rules off (358 entries,
 *     including deprecated ones), so it is excluded from the Deprecated
 *     and Unknown categories by object identity — auditing upstream's
 *     block is upstream's job. Its core-rule ids that still exist
 *     (curly, no-unexpected-multiline, the stylistic set) DO count as
 *     decided for the Missing category, since they ship in `base`.
 *   - "Missing" is judged against the union of all exports, because the
 *     package is composable: a jest rule is decided in the jest export,
 *     not in base. What matters is that every available rule is decided
 *     *somewhere* in the package.
 *   - The pending export (`reactPending`, subpath-only — issue #8) is
 *     audited exactly like a composed export: the plugin it registers
 *     counts as registered and its entries as configured/decided.
 *     Holding the @eslint-react rules out of `react` pending TypeScript
 *     7 support must not let them silently rot — the weekly audit keeps
 *     them current, so restoration is a composition change against an
 *     already-current rule set, never a catch-up rewrite. (The audit
 *     runs on this package's own toolchain, where the pending export
 *     loads; the TS7 load failure is the consumer fixture's job —
 *     test/ts7Consumer.test.mjs.)
 *   - Deprecated rules are never "missing": the policy for a deprecated
 *     rule is removal, not a fresh explicit entry.
 *   - Some plugins register one rule object under several names
 *     (@eslint-react v5 registers every rule under both its plain name
 *     and an `x-` prefixed alias — the identical object). A rule counts
 *     as decided when ANY of its registered names is configured; the
 *     report names the plain (non-alias) name.
 *
 * Run `npm run build` first (the `check-rules` npm script does).
 */
import process from 'node:process';

import {builtinRules} from 'eslint/use-at-your-own-risk';
import prettierConfig from 'eslint-config-prettier';

import * as pkg from '../dist/index.js';
import reactPending from '../dist/react-pending.js';

const EXPORTS = [
  'base',
  'jest',
  'node',
  'react',
  'reactNative',
  'tailwind',
  'typescriptPendingIgnores',
];

/** ruleId -> {deprecated: boolean, replacedBy: string[], source: string} */
const available = new Map();
/**
 * ruleId -> Set of export names that configure it, in blocks this
 * package owns (the audit categories judge these). The prettier block
 * is upstream-owned and excluded here; see `decided` below.
 */
const configured = new Map();
/**
 * Every ruleId decided anywhere in the shipped composition, including
 * the prettier block's still-existing core ids — the Missing category
 * judges this set.
 */
const decided = new Map();
/** plugin prefixes registered by any export. */
const registeredPrefixes = new Set();
/** rule object -> Set of ruleIds it is registered under (aliases). */
const idsByRuleObject = new Map();

function deprecationOf(rule) {
  const dep = rule?.meta?.deprecated;
  if (!dep) return {deprecated: false, replacedBy: []};
  const replacedBy =
    typeof dep === 'object' && Array.isArray(dep.replacedBy)
      ? dep.replacedBy.map(entry => entry?.rule?.name).filter(Boolean)
      : [];
  return {deprecated: true, replacedBy};
}

function registerAvailable(ruleId, rule, source) {
  available.set(ruleId, {...deprecationOf(rule), source});
  if (rule && (typeof rule === 'object' || typeof rule === 'function')) {
    if (!idsByRuleObject.has(rule)) idsByRuleObject.set(rule, new Set());
    idsByRuleObject.get(rule).add(ruleId);
  }
}

for (const [name, rule] of builtinRules) {
  registerAvailable(name, rule, 'eslint core');
}

// The pending export ships subpath-only (issue #8), so it is not a
// key of the root module; it is audited alongside the root exports
// under the name 'reactPending' (see the header's scope notes).
const EXPORT_SOURCES = [
  ...EXPORTS.map(name => [name, pkg[name]]),
  ['reactPending', reactPending],
];

for (const [exportName, blocks] of EXPORT_SOURCES) {
  if (!Array.isArray(blocks)) continue;
  for (const block of blocks) {
    if (block.plugins) {
      for (const [prefix, plugin] of Object.entries(block.plugins)) {
        registeredPrefixes.add(prefix);
        for (const [ruleName, rule] of Object.entries(plugin.rules ?? {})) {
          registerAvailable(
            `${prefix}/${ruleName}`,
            rule,
            `plugin '${prefix}' (export '${exportName}')`,
          );
        }
      }
    }
    const isPrettierBlock = block.rules && block.rules === prettierConfig.rules;
    for (const ruleId of Object.keys(block.rules ?? {})) {
      if (isPrettierBlock) {
        // Upstream-owned block: never audited, but its still-existing
        // core ids are real decisions shipped in `base` and count
        // toward Missing. Its other ids are defensive entries for
        // plugins and ancient ESLint versions (see header).
        if (!ruleId.includes('/') && available.has(ruleId)) {
          if (!decided.has(ruleId)) decided.set(ruleId, new Set());
          decided.get(ruleId).add(exportName);
        }
        continue;
      }
      if (!configured.has(ruleId)) configured.set(ruleId, new Set());
      configured.get(ruleId).add(exportName);
      if (!decided.has(ruleId)) decided.set(ruleId, new Set());
      decided.get(ruleId).add(exportName);
    }
  }
}

const deprecated = [];
const unknown = [];
for (const [ruleId, exportsSet] of configured) {
  const where = [...exportsSet].join(', ');
  const prefix = ruleId.includes('/')
    ? ruleId.slice(0, ruleId.lastIndexOf('/'))
    : null;
  if (available.has(ruleId)) {
    const info = available.get(ruleId);
    if (info.deprecated) {
      const hint =
        info.replacedBy.length > 0
          ? ` — replaced by ${info.replacedBy.join(', ')}`
          : '';
      deprecated.push(`${ruleId} (configured in: ${where})${hint}`);
    }
  } else if (prefix === null || registeredPrefixes.has(prefix)) {
    // Core rule that no longer exists, or a rule of a plugin this
    // package registers that no longer exists in the installed plugin.
    unknown.push(`${ruleId} (configured in: ${where})`);
  }
}

const missing = [];
for (const [ruleId, info] of available) {
  if (info.deprecated) continue; // deprecated rules are removed, not added
  // Alias grouping: decided if any registered name of the same rule
  // object is configured.
  let isDecided = decided.has(ruleId);
  if (!isDecided) {
    for (const ids of idsByRuleObject.values()) {
      if (ids.has(ruleId)) {
        isDecided = [...ids].some(id => decided.has(id));
        break;
      }
    }
  }
  if (!isDecided) missing.push(`${ruleId} (from ${info.source})`);
}

const sections = [
  ['DEPRECATED rules still configured (policy: remove them)', deprecated],
  ['REMOVED / UNKNOWN rules still configured (policy: remove them)', unknown],
  [
    'MISSING rules with no explicit entry (policy: add one; off needs a rationale comment)',
    missing,
  ],
];

const log = line => process.stdout.write(`${line}\n`);
let findings = 0;
for (const [title, list] of sections) {
  list.sort();
  findings += list.length;
  log(`\n${title}: ${list.length}`);
  for (const line of list) log(`  - ${line}`);
}

if (findings > 0) {
  log(
    `\ncheck-rules: ${findings} finding(s). See issue #2 for the policy each category follows.`,
  );
  process.exit(1);
}
log(
  '\ncheck-rules: clean — every available rule is explicitly configured, none deprecated or unknown.',
);
