# Verification

## Issue #3 Pilot Preparation

This review prepares the pilot; it does not complete school acceptance. The procedure and unfilled evidence form are [Pilot Procedure](PILOT.md) and [Pilot Results](PILOT_RESULTS.md). Issue #3 stays open.

- `npm test`: all 16 checks pass. Added coverage verifies concurrent durable main allocation, rejection of stale main before any write, two distinct clean build identities, preservation of an earlier artifact, generated Actions outputs/summary, and the exact student distribution allowlist.
- `npm run verify:content`: all 14 questions, 95 controls, 20 prediction fields, two sketches, and 14 diagrams pass. The cleared content, application UI, response schemas, and release record are unchanged from merged issue #2.
- Both workflow YAML files parse; the updated browser test passes syntax checking; `git diff --check` passes.
- Hosted Chromium source-preview verification: **passed** in [Actions run 36502020951](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/actions/runs/36502020951), including all existing download, restore, part isolation, keyboard, storage-failure, and layout checks. The new check restores a fictional backup in a fresh browser context, then closes/reopens that tab and verifies the restored answer. This is a browser-profile simulation of a device change, not a physical managed-device trial.

Current local review build:

`0.1.0_First-Light_local-72e915e3_build-002_20260929T001308Z_gf7b5c7e35ee8_web`

- Clean source: `f7b5c7e35ee82774fd28882e7a87063837cc3e8f`.
- Build UTC: `2026-09-29T00:13:08.530Z`.
- Input fingerprint: `448066c97cc8f07d1a643f0d4980488f61aced8af8898d742ab501f4a2cbb8a2`.
- [Immutable manifest](builds/0.1.0_First-Light_local-72e915e3_build-002_20260929T001308Z_gf7b5c7e35ee8_web.json).
- The build succeeded; the console, enclosing artifact directory, manifest, and generated `BUILD.md` agree. This local artifact has not been exercised in a live browser during this session. The deployment workflow will run the full smoke test against its own exact artifact before uploading it.
- Local ordinal 001 was built before the connector-created commit existed; ordinal 002 uses the public PR source commit with an identical source tree and input fingerprint. Neither is presented as a PR-ledger allocation. The local scope remains explicit because shared allocation credentials were unavailable here.
- Live durable reservation/claim on GitHub and actual Pages deployment remain unverified until the workflow runs after merge. Repository-level `contents: write` is required for ledger creation; Pages needs its existing environment and Actions source configuration.

A public HTTP check retrieved the companion game's live manifest and found the activity root returned 404; details are in [Pilot Results](PILOT_RESULTS.md). Live browser interaction stalled. No full game playthrough, school-network/Blocksi test, Classroom attachment/Turn In/teacher review, or physical cross-device trial was performed. No school account was connected. Public fixtures contain only fictional identities and arbitrary responses, never a teacher key.

This evidence update changes documentation only. Reuse the reviewed artifact; do not rebuild it merely to change its report.

## Historical Issue #2 Implementation Review

The dependency-free shared shell uses only the cleared lever selection and newly authored workflow-practice content. The original reviewed lever wording, diagrams, and content hash remain unchanged. Public tests use fictional identities and deliberately arbitrary responses, not a teacher key.

- `npm test`: 14 focused checks pass, including schema isolation, prediction/observation preservation, strict restore rejection, per-part snapshots, storage failures, stale tabs, explicit public-file selection, and simulated concurrent durable build allocation.
- `npm run verify:content`: 14 questions, 95 controls, 20 prediction fields, two sketches, and 14 diagrams pass exact-byte and student-only checks.
- `tests/browser-smoke.mjs`: Chromium source-preview checks pass for desktop and 390-pixel layouts, autosave reload, actual JSON/text/backup downloads, restore confirmation, invalid/submission rejection, per-part exports, earlier-response reference, missing-field focus, activity isolation, keyboard navigation, literal answer markup, cross-tab warning, blocked storage, and corrupt saved-data recovery, and visible recovery of older content revisions.

## Historical Issue #2 Build Review

Issue #2 review build:

`0.1.0_First-Light_local-72a3d7ee_build-003_20260928T232430Z_gbaa69c6b8048_web`

- Clean source: `baa69c6b8048ef54fc21ef34b5a55c46c194e5cb`.
- Build UTC: `2026-09-28T23:24:30.208Z`.
- Input fingerprint: `16b1d952b295593c6df4132890b621eb093124fd87793b7160dbfeeb591bf9b2`.
- [Immutable manifest](builds/0.1.0_First-Light_local-72a3d7ee_build-003_20260928T232430Z_gbaa69c6b8048_web.json).
- The final built files pass the full Chromium smoke test, including the new earlier-revision recovery notice and the original restore/download paths.
- The build console, versioned artifact directory, embedded manifest, visible UI footer, generated BUILD.md, JSON submission, and readable companion all carry this same full identifier.
- Two successive builds of clean source `2f34c71dde7a76701a79d67dbde663ec9e47d294` received distinct local ordinals 001 and 002. The final recovery improvement used ordinal 003. The same artifact was reused for browser testing without renaming or rebuilding it.
- Earlier manifests remain in `docs/builds/`, including the initial explicitly dirty local attempt. This is an explicit local review scope minted before a PR number existed; it is not a fabricated PR-scoped build.
- Final desktop and mobile screenshots were visually inspected; no horizontal page overflow at 390 px. The desktop sidebar scrolls within short viewports.

Build allocation rules and the surface inventory are in [Build Identity](BUILD_IDENTITY.md). Committing this verification record changes documentation only; it does not change build inputs or require rebuilding the reviewed artifact.

## Repeat Browser Checks

Install Playwright and Chromium as development test tools outside the student bundle. Serve the chosen build using the script's automatically started Python server, then run:

```sh
TEST_BASE_URL=http://127.0.0.1:4173/dist/ACTUAL-BUILD-IDENTIFIER/ node tests/browser-smoke.mjs
```

`PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` can select existing installations. `EXTERNAL_TEST_SERVER=1` reuses an existing server. Screenshots and fictional downloads are written to ignored `test-results/`. The hosted verification workflow now also runs the source-preview Chromium checks, including restoration into a fresh browser profile and closed-tab resume. It does not deploy. The Pages workflow separately checks the exact built artifact before publishing it.

## Remaining Pilot Work

No deployment, real student data, live-game playthrough, managed-school-browser trial, or Classroom attachment/Turn In round trip was performed. These remain issue #3. PR allocation concurrency was tested against a simulated GitHub API; no live PR build reservation has been used. Local browser automation is evidence about this implementation, not certification of school network policies or classroom readiness.
