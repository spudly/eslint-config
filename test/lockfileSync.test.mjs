import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {URL} from 'node:url';

import {satisfies} from 'semver';

// Lockfile-sync guard (issue #34, sibling of eciperay #445): a
// Dependabot-style bump can raise a manifest spec while the lockfile
// keeps a stale resolved version, and nothing else in CI notices.
// For every direct dependency, the version locked in
// package-lock.json must satisfy the spec declared in package.json.
// Range semantics come from the `semver` package itself (the parser
// npm uses), so prereleases, partial bounds, and hyphen ranges all
// behave exactly as npm would treat them.

function readJson(relativePath) {
  return JSON.parse(
    readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
  );
}

test('semver range semantics used by the lockfile check', () => {
  assert.equal(satisfies('4.5.0', '4.5.0'), true);
  assert.equal(satisfies('4.5.1', '4.5.0'), false);
  assert.equal(satisfies('5.28.8', '^5.28.8'), true);
  assert.equal(satisfies('6.0.0', '^5.28.8'), false);
  assert.equal(satisfies('0.2.5', '^0.2.3'), true);
  assert.equal(satisfies('0.3.0', '^0.2.3'), false);
  assert.equal(satisfies('0.0.5', '^0.0'), true);
  assert.equal(satisfies('0.1.0', '^0.0'), false);
  assert.equal(satisfies('1.2.9', '~1.2.3'), true);
  assert.equal(satisfies('1.3.0', '~1.2.3'), false);
  assert.equal(satisfies('10.13.0', '^10.12.0'), true);
  assert.equal(satisfies('9.9.9', '>=8.0.0 <11.0.0'), true);
  assert.equal(satisfies('11.0.0', '>=8.0.0 <11.0.0'), false);
  assert.equal(satisfies('1.2.3-beta.1', '1.2.3-beta.1'), true);
  assert.equal(satisfies('1.2.3+build.1', '1.2.3'), true);
  assert.equal(satisfies('1.3.0', '>1.2'), true);
  assert.equal(satisfies('1.2.1', '>1.2'), false);
  assert.equal(satisfies('1.2.1', '<=1.2'), true);
  assert.equal(satisfies('1.5.0', '1.2.3 - 2.3.4'), true);
  assert.equal(satisfies('2.3.5', '1.2.3 - 2.3.4'), false);
});

test('every direct dependency locked version satisfies its spec', () => {
  const manifest = readJson('../package.json');
  const lockfile = readJson('../package-lock.json');
  const direct = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  };
  const stale = [];
  for (const [name, spec] of Object.entries(direct)) {
    const locked = lockfile.packages?.[`node_modules/${name}`]?.version;
    if (!locked) {
      stale.push(`${name}: spec "${spec}" has no locked entry`);
    } else if (!satisfies(locked, spec)) {
      stale.push(`${name}: locked ${locked} does not satisfy "${spec}"`);
    }
  }
  assert.deepEqual(stale, []);
});
