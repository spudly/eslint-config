// Parser for the per-rule markdown fixtures in test/rules/ — the
// files that are documentation and behavior tests at the same time
// (Stephen's design, 2026-10-24). The format is deliberately small
// and strict:
//
//   # Rule: <ruleId>
//
//   ## Rule Description
//   <one or two plain sentences>
//
//   ## Configuration
//   ```js
//   { // ... '<ruleId>': '<severity>', ... }
//   ```
//
//   ## Test setup
//   - Export: <export the snippets run under>
//   - File: <virtual filename the snippets are linted as>
//
//   ## Bad
//   ```js
//   <snippet that must trigger the rule>
//   ```
//
//   ## Good
//   ```js
//   <snippet that must not trigger the rule>
//   ```
//
// A rule that no snippet can trigger (it needs real files on disk,
// module resolution, or a real filename) replaces Bad/Good with:
//
//   ## Not snippet-testable
//   <the concrete reason>
//
// Anything malformed — a missing section, a missing or unterminated
// code fence, an empty description — throws an error naming the file,
// so a broken fixture fails the suite with a readable message instead
// of silently testing nothing.

const SECTION_ORDER = ['Rule Description', 'Configuration', 'Test setup'];
const FENCE = /^```(\w*)$/;

function fail(fileLabel, message) {
  throw new Error(`${fileLabel}: ${message}`);
}

function extractFence(fileLabel, sectionName, lines) {
  const open = lines.findIndex(line => FENCE.test(line.trim()));
  if (open === -1) {
    fail(fileLabel, `section "${sectionName}" has no code fence`);
  }
  const close = lines.findIndex(
    (line, index) => index > open && line.trim() === '```',
  );
  if (close === -1) {
    fail(fileLabel, `section "${sectionName}" has an unterminated code fence`);
  }
  return lines
    .slice(open + 1, close)
    .join('\n')
    .trim();
}

function sectionText(lines) {
  return lines.join('\n').trim();
}

function readSections(lines, fileLabel) {
  const sections = new Map();
  let current = null;
  for (const line of lines) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      current = heading[1].trim();
      if (sections.has(current)) {
        fail(fileLabel, `duplicate section "${current}"`);
      }
      sections.set(current, []);
    } else if (current !== null) {
      sections.get(current).push(line);
    }
  }
  for (const name of SECTION_ORDER) {
    if (!sections.has(name)) {
      fail(fileLabel, `missing section "${name}"`);
    }
  }
  return sections;
}

function parseTestSetup(lines, fileLabel) {
  const setup = new Map();
  for (const line of lines) {
    const entry = /^- (Export|File): (.+)$/.exec(line.trim());
    if (entry) setup.set(entry[1], entry[2].trim());
  }
  if (!setup.has('Export') || !setup.has('File')) {
    fail(fileLabel, 'Test setup needs "- Export: ..." and "- File: ..."');
  }
  return {exportName: setup.get('Export'), fileName: setup.get('File')};
}

function finishDoc(sections, fileLabel, base) {
  if (sections.has('Not snippet-testable')) {
    if (sections.has('Bad') || sections.has('Good')) {
      fail(fileLabel, 'has both "Not snippet-testable" and Bad/Good');
    }
    const rationale = sectionText(sections.get('Not snippet-testable'));
    if (rationale === '') {
      fail(fileLabel, 'section "Not snippet-testable" is empty');
    }
    return {...base, notTestable: rationale};
  }
  if (!sections.has('Bad') || !sections.has('Good')) {
    fail(fileLabel, 'missing "Bad"/"Good" (or "Not snippet-testable")');
  }
  const bad = extractFence(fileLabel, 'Bad', sections.get('Bad'));
  const good = extractFence(fileLabel, 'Good', sections.get('Good'));
  if (bad === '' || good === '') {
    fail(fileLabel, 'Bad and Good snippets must not be empty');
  }
  return {...base, bad, good};
}

export function parseRuleDoc(source, fileLabel) {
  const lines = source.split('\n');
  const title = lines.find(line => line.trim() !== '');
  const titleMatch = /^# Rule: (\S+)$/.exec(title?.trim() ?? '');
  if (!titleMatch) {
    fail(fileLabel, 'first line must be "# Rule: <ruleId>"');
  }
  const ruleId = titleMatch[1];
  const sections = readSections(lines.slice(1), fileLabel);
  const description = sectionText(sections.get('Rule Description'));
  if (description === '') {
    fail(fileLabel, 'section "Rule Description" is empty');
  }
  const configuration = extractFence(
    fileLabel,
    'Configuration',
    sections.get('Configuration'),
  );
  if (!configuration.includes(ruleId)) {
    fail(fileLabel, 'Configuration block does not show the rule entry');
  }
  const base = {
    ruleId,
    description,
    fileLabel,
    ...parseTestSetup(sections.get('Test setup'), fileLabel),
  };
  return finishDoc(sections, fileLabel, base);
}

export function ruleIdForPath(relativePath) {
  // test/rules/core/<rule>.md -> <rule> (ESLint core rules);
  // test/rules/<plugin>/<rule>.md -> <plugin>/<rule>. A rule name
  // may itself contain a slash (n/prefer-promises/fs lives at
  // test/rules/n/prefer-promises/fs.md): the plugin is the first
  // segment and the rule is the rest.
  const parts = relativePath.split('/');
  const file = parts.at(-1).replace(/\.md$/, '');
  if (parts.at(-2) === 'core') return file;
  return `${parts[0]}/${[...parts.slice(1, -1), file].join('/')}`;
}
