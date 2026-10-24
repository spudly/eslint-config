import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  base,
  jest,
  node,
  react,
  reactNative,
  tailwind,
  typescriptPendingIgnores,
} from '../dist/index.js';

// Stephen (2026-10-24): the shared config must not bake in any repo's
// directory layout. Extension/language scoping is intrinsic to the
// rules and may stay; directory-layout scoping moves to consumers.
//
// A glob segment counts as directory layout when it is a bare literal
// name — no wildcard, no extension dot: `packages`, `src`, `server`,
// `{server,mcp-server}`, ... A segment carrying a wildcard or a dot
// is a filename/extension pattern (`*.{ts,tsx}`, `jest.setup.{ts,js}`,
// `*.test.ts`): a language/tooling convention, and allowed.
//
// Sole exception: `__tests__` is part of Jest's default testMatch —
// a Jest-ecosystem convention, not one repo's layout.
const ALLOWED_LITERAL_SEGMENTS = new Set(['__tests__']);

function layoutSegments(pattern) {
  const bad = [];
  for (const segment of pattern.split('/')) {
    if (segment === '' || segment === '**') continue;
    if (ALLOWED_LITERAL_SEGMENTS.has(segment)) continue;
    if (/[*[\].]/.test(segment)) continue;
    bad.push(segment);
  }
  return bad;
}

const allExports = {
  base,
  jest,
  node,
  react,
  reactNative,
  tailwind,
  typescriptPendingIgnores,
};

test('no export carries a directory-layout files/ignores glob', () => {
  const violations = [];
  for (const [name, blocks] of Object.entries(allExports)) {
    for (const block of blocks) {
      for (const key of ['files', 'ignores']) {
        for (const pattern of block[key] ?? []) {
          for (const seg of layoutSegments(pattern)) {
            violations.push(`${name}: ${key} "${pattern}" (segment "${seg}")`);
          }
        }
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('the export surface is exactly the small list Stephen approved', async () => {
  const index = await import('../dist/index.js');
  assert.deepEqual(Object.keys(index).sort(), [
    'base',
    'jest',
    'node',
    'react',
    'reactNative',
    'tailwind',
    'typescriptPendingIgnores',
  ]);
});
