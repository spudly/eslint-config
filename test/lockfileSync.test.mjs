import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {URL} from 'node:url';

// Lockfile-sync guard (issue #34, sibling of eciperay #445): a
// Dependabot-style bump can raise a manifest spec while the lockfile
// keeps a stale resolved version, and nothing else in CI notices.
// For every direct dependency, the version locked in
// package-lock.json must satisfy the spec declared in package.json.
// Dependency-free on purpose: the check itself can never desync.

function readJson(relativePath) {
  return JSON.parse(
    readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
  );
}

function parseVersion(text) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(text);
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(a, b) {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  return 0;
}

function isWildcard(part) {
  return part === null || part === undefined;
}

// A comparator token is an optional operator plus a possibly partial
// version; missing or wildcard parts widen it into a range per npm
// semver semantics (^, ~, x-ranges, bare partials).
function parseComparator(token) {
  const match = /^(\^|~|>=|<=|>|<|=)?(.+)$/.exec(token);
  const parts = match[2]
    .split('.')
    .map(part => (part === 'x' || part === 'X' || part === '*' ? null : part));
  const floor = [0, 1, 2].map(index =>
    isWildcard(parts[index]) ? 0 : Number(parts[index]),
  );
  const firstWildcard = parts.findIndex(isWildcard);
  return {
    floor,
    operator: match[1] ?? '',
    precision: firstWildcard === -1 ? 3 : firstWildcard,
  };
}

function ceilingAfter(floor, fixedIndex) {
  const ceiling = [...floor];
  ceiling[fixedIndex] += 1;
  for (let index = fixedIndex + 1; index < 3; index += 1) ceiling[index] = 0;
  return ceiling;
}

function inRange(version, floor, ceiling) {
  return (
    compareVersions(version, floor) >= 0 &&
    compareVersions(version, ceiling) < 0
  );
}

function satisfiesComparator(version, {floor, operator, precision}) {
  if (precision === 0) return true;
  if (operator === '^') {
    // Caret: the leftmost non-zero component is fixed.
    const fixed =
      floor[0] > 0 ? 0 : floor[1] > 0 ? 1 : floor[2] > 0 ? 2 : precision - 1;
    return inRange(version, floor, ceilingAfter(floor, fixed));
  }
  if (operator === '~') {
    return inRange(version, floor, ceilingAfter(floor, precision <= 1 ? 0 : 1));
  }
  if (operator === '' || operator === '=') {
    if (precision === 3) return compareVersions(version, floor) === 0;
    return inRange(version, floor, ceilingAfter(floor, precision - 1));
  }
  const compared = compareVersions(version, floor);
  if (operator === '>=') return compared >= 0;
  if (operator === '<=') return compared <= 0;
  if (operator === '>') return compared > 0;
  return compared < 0;
}

function satisfies(version, spec) {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  return spec.split('||').some(alternative =>
    alternative
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .every(token => satisfiesComparator(parsed, parseComparator(token))),
  );
}

test('semver range semantics used by the lockfile check', () => {
  assert.equal(satisfies('4.5.0', '4.5.0'), true);
  assert.equal(satisfies('4.5.1', '4.5.0'), false);
  assert.equal(satisfies('5.28.8', '^5.28.8'), true);
  assert.equal(satisfies('6.0.0', '^5.28.8'), false);
  assert.equal(satisfies('0.2.5', '^0.2.3'), true);
  assert.equal(satisfies('0.3.0', '^0.2.3'), false);
  assert.equal(satisfies('1.2.9', '~1.2.3'), true);
  assert.equal(satisfies('1.3.0', '~1.2.3'), false);
  assert.equal(satisfies('10.13.0', '^10.12.0'), true);
  assert.equal(satisfies('9.9.9', '>=8.0.0 <11.0.0'), true);
  assert.equal(satisfies('11.0.0', '>=8.0.0 <11.0.0'), false);
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
