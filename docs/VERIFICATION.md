# Issue #2 Verification

## Implementation Review

The dependency-free shared shell uses only the cleared lever selection and newly authored workflow-practice content. The original reviewed lever wording, diagrams, and content hash remain unchanged. Public tests use fictional identities and deliberately arbitrary responses, not a teacher key.

- `npm test`: 14 focused checks pass, including schema isolation, prediction/observation preservation, strict restore rejection, per-part snapshots, storage failures, stale tabs, explicit public-file selection, and simulated concurrent durable build allocation.
- `npm run verify:content`: 14 questions, 95 controls, 20 prediction fields, two sketches, and 14 diagrams pass exact-byte and student-only checks.
- `tests/browser-smoke.mjs`: Chromium source-preview checks pass for desktop and 390-pixel layouts, autosave reload, actual JSON/text/backup downloads, restore confirmation, invalid/submission rejection, per-part exports, earlier-response reference, missing-field focus, activity isolation, keyboard navigation, literal answer markup, cross-tab warning, blocked storage, and corrupt saved-data recovery.

## Build Review

The exact review build and final artifact consistency results are added after the immutable build is produced. Build allocation rules and the surface inventory are in [Build Identity](BUILD_IDENTITY.md).

## Repeat Browser Checks

Install Playwright and Chromium as development test tools outside the student bundle. Serve the chosen build using the script's automatically started Python server, then run:

```sh
TEST_BASE_URL=http://127.0.0.1:4173/dist/ACTUAL-BUILD-IDENTIFIER/ node tests/browser-smoke.mjs
```

`PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` can select existing installations. `EXTERNAL_TEST_SERVER=1` reuses an existing server. Screenshots and fictional downloads are written to ignored `test-results/`. The hosted test-only workflow runs the unit/content checks; it does not claim browser validation or produce a build.

## Remaining Pilot Work

No deployment, real student data, live-game playthrough, managed-school-browser trial, or Classroom attachment/Turn In round trip was performed. These remain issue #3. PR allocation concurrency was tested against a simulated GitHub API; no live PR build reservation has been used. Local browser automation is evidence about this implementation, not certification of school network policies or classroom readiness.
