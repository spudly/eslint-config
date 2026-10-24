import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {test} from 'node:test';
import {URL, fileURLToPath} from 'node:url';

import {ESLint} from 'eslint';

import {EXPORTS, loadEnabledRules} from './enabledRules.mjs';
import {parseRuleDoc, ruleIdForPath} from './ruleDocs.mjs';

// Markdown-driven rule behavior tests (Stephen's design, 2026-10-24,
// follow-up to the Option A suite from issue #3): every enabled rule
// has one markdown file under test/rules/ that is its documentation
// AND its behavior fixture. The parser (ruleDocs.mjs) turns each file
// into a test: the Bad snippet must trigger the rule and the Good
// snippet must not, both linted with the real ESLint class under the
// composed export the file names. Other rules firing on a snippet is
// fine — with this many rules composed, cross-fire is expected; only
// the named rule is asserted. A fatal parse error in either snippet
// fails the test.
//
// This harness replaces the hand-written fixtures in the former
// behavior.test.mjs (PR #11): those seven rules are fixtures here
// like every other. Composition and smoke tests are untouched.

const rulesDir = fileURLToPath(new URL('rules', import.meta.url));

const fixtures = fs
  .readdirSync(rulesDir, {recursive: true})
  .filter(name => name.endsWith('.md'))
  .sort()
  .map(relativePath => {
    const source = fs.readFileSync(path.join(rulesDir, relativePath), 'utf8');
    const fixture = parseRuleDoc(source, `test/rules/${relativePath}`);
    assert.equal(
      fixture.ruleId,
      ruleIdForPath(relativePath),
      `${fixture.fileLabel}: title rule does not match the file path`,
    );
    return fixture;
  });

// Parsing scaffold only (JSX on): the exports under test carry
// rules and plugins, not parser options. The source type is left to
// ESLint's per-extension defaults on purpose — a few core rules
// (no-with, no-octal, no-dupe-args) can only trigger in the sloppy
// mode of a .cjs fixture, which a forced 'module' would make a parse
// error instead of a lint report.
const jsxScaffold = {
  languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}},
};

const eslintByExport = new Map();
function eslintFor(exportName) {
  if (!eslintByExport.has(exportName)) {
    const config = [jsxScaffold, ...EXPORTS[exportName]];
    // This repo does not install jest itself, so the version is
    // pinned via settings (consumers with jest installed get
    // auto-detection).
    if (exportName === 'jest') {
      config.push({settings: {jest: {version: 30}}});
    }
    eslintByExport.set(
      exportName,
      new ESLint({overrideConfig: config, overrideConfigFile: true}),
    );
  }
  return eslintByExport.get(exportName);
}

async function messagesFor(fixture, code) {
  const [result] = await eslintFor(fixture.exportName).lintText(code, {
    filePath: fixture.fileName,
  });
  return result.messages;
}

for (const fixture of fixtures) {
  const name = `rule ${fixture.ruleId}: bad triggers, good passes`;
  if (fixture.notTestable) {
    test(name, {skip: fixture.notTestable}, () => {
      // Documented skip: the fixture file itself carries the reason.
    });
    continue;
  }
  test(name, async () => {
    const bad = await messagesFor(fixture, fixture.bad);
    assert.ok(
      !bad.some(message => message.fatal),
      `${fixture.ruleId}: Bad snippet has a fatal parse error: ${bad.find(message => message.fatal)?.message ?? ''}`,
    );
    assert.ok(
      bad.some(message => message.ruleId === fixture.ruleId),
      `${fixture.ruleId}: Bad snippet did not trigger the rule (got: ${bad.map(message => message.ruleId).join(', ') || 'nothing'})`,
    );
    const good = await messagesFor(fixture, fixture.good);
    assert.ok(
      !good.some(message => message.fatal),
      `${fixture.ruleId}: Good snippet has a fatal parse error: ${good.find(message => message.fatal)?.message ?? ''}`,
    );
    assert.ok(
      !good.some(message => message.ruleId === fixture.ruleId),
      `${fixture.ruleId}: Good snippet must not trigger the rule`,
    );
  });
}

test('rule fixtures: one markdown file per enabled rule', async () => {
  const enabled = await loadEnabledRules();
  const fixtureIds = new Set(fixtures.map(fixture => fixture.ruleId));
  const missing = [...enabled.keys()].filter(id => !fixtureIds.has(id));
  const stale = [...fixtureIds].filter(id => !enabled.has(id));
  assert.deepEqual(
    missing,
    [],
    `enabled rules without a markdown fixture: ${missing.join(', ')}`,
  );
  assert.deepEqual(
    stale,
    [],
    `fixtures for rules no export enables: ${stale.join(', ')}`,
  );
  for (const fixture of fixtures) {
    assert.ok(
      enabled.get(fixture.ruleId)?.has(fixture.exportName),
      `${fixture.ruleId}: export "${fixture.exportName}" does not enable it`,
    );
  }
});
