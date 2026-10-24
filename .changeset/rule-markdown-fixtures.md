---
'@spudly/eslint-config': patch
---

Test-only change (no published files change — the tarball ships only
`dist`): the behavior tests are now markdown-driven. Every enabled
rule has one markdown file under `test/rules/` that serves as its
documentation and its behavior fixture at the same time (description,
the rule's configured entry, and Bad/Good snippets linted with the
real ESLint class under the composed export). A strict, dependency-
free parser plus a data-driven harness replace the seven hand-written
behavior tests from the Option A suite; a coverage test enumerates
every enabled rule across all exports and fails if one lacks a
fixture, so the weekly check-rules flow now demands a fixture and
doc for every newly enabled rule. Rules no snippet can honestly
trigger document why in a Not snippet-testable section and are
reported as documented skips. Composition and smoke tests are
unchanged; no rule or export behavior changes.
