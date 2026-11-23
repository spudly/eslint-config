---
'@spudly/eslint-config': minor
---

Add the `no-source-reads-in-tests/no-source-reads-in-tests` rule to the shared `jest` export, at `warn` for test files: a test file that reads a JS/TS source file (for example `readFileSync` on a `.ts`/`.tsx` path, a `src/` directory enumeration, or a local read helper called with a source path) is now reported, because source-string pins protect spelling, not behavior — assert the behavior instead. Reads of data files (`.json`, `.md`, `.css`, `.html`, `package.json`), declaration files (`.d.ts`), and built `dist/` output are not flagged.
