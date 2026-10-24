// Enumerates the rules each export of this package actually enables,
// by composing every export exactly as it ships and asking ESLint for
// the effective config of probe filenames covering each export's
// `files` globs. A rule counts as enabled in an export when some
// filename the export applies to gets it at 'warn' or 'error'.
//
// Judging by the composed config (not by source entries) matters:
// the eslint-config-prettier block inside `base` switches four
// unicorn rules off (unicorn/empty-brace-spaces,
// unicorn/no-nested-ternary, unicorn/number-literal-case,
// unicorn/template-indent) even though src/unicorn.ts sets them to
// 'error' — as shipped, no consumer ever sees them fire, so they need
// no fixture. If a future composition change makes them effective,
// this enumeration starts counting them and the coverage test in
// ruleFixtures.test.mjs demands their fixtures.
import {ESLint} from 'eslint';

import {base, jest, node, react, reactNative, tailwind} from '../dist/index.js';
import reactPending from '../dist/react-pending.js';

export const EXPORTS = {
  base,
  jest,
  node,
  react,
  reactNative,
  tailwind,
  reactPending,
};

const PROBES = {
  base: [
    'fixture.ts',
    'fixture.tsx',
    'fixture.js',
    'fixture.jsx',
    'fixture.cjs',
    'fixture.mjs',
  ],
  jest: [
    'fixture.test.ts',
    'fixture.test.js',
    'fixture.test.tsx',
    'fixture.test.jsx',
    'fixture.test.cjs',
    'fixture.spec.ts',
    'fixture.spec.js',
    'jest.setup.ts',
    'jest.setup.js',
    'jest.setup.cjs',
    'jest.env.ts',
    'jest.setupEnv.ts',
    '__tests__/fixture.ts',
    '__tests__/fixture.tsx',
    '__tests__/fixture.js',
    '__tests__/fixture.jsx',
  ],
  node: ['fixture.js'],
  react: ['fixture.ts', 'fixture.tsx', 'fixture.jsx'],
  reactNative: ['fixture.ts', 'fixture.tsx', 'fixture.jsx'],
  tailwind: ['fixture.tsx', 'fixture.jsx'],
  reactPending: ['fixture.ts', 'fixture.tsx', 'fixture.jsx'],
};

function severityOf(value) {
  const severity = Array.isArray(value) ? value[0] : value;
  return {0: 'off', 1: 'warn', 2: 'error'}[severity] ?? severity;
}

/** Map of ruleId -> Set of export names that enable it. */
export async function loadEnabledRules() {
  const enabled = new Map();
  for (const [exportName, blocks] of Object.entries(EXPORTS)) {
    const eslint = new ESLint({
      overrideConfig: blocks,
      overrideConfigFile: true,
    });
    for (const probe of PROBES[exportName]) {
      const config = await eslint.calculateConfigForFile(probe);
      for (const [ruleId, value] of Object.entries(config?.rules ?? {})) {
        if (severityOf(value) === 'off') continue;
        if (!enabled.has(ruleId)) enabled.set(ruleId, new Set());
        enabled.get(ruleId).add(exportName);
      }
    }
  }
  return enabled;
}
