# Preservation Roadmap

## Purpose

Preserve the September 28, 2026 decisions in a durable, reviewable form and make the next conversation easy to resume. The original checkpoint contained documentation only. Issues #1 and #2 now provide selected content and a development activity workflow; no class-wide release is implied. Unreviewed activity files are retained separately in the private recovery materials.

Read [Decisions And Discussion](DECISIONS.md) for the full distinction between agreed direction, proposals, historical behavior, and open decisions.

## Small Follow-Up Tasks

| Order | Task | Completion Boundary |
| --- | --- | --- |
| 1 | [#1: Content Provenance](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/1) | Identify or independently replace every prompt and asset selected for publication; keep unresolved sources private. |
| 2 | [#2: Activity And Submission Workflow](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/2) | Implement the shared student interface, recoverable drafts, and versioned per-part answer exports using cleared content. |
| 3 | [#3: Classroom Pilot](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/3) | Verify the game/activity and the download-to-Classroom round trip on school devices before broad assignment. |

## Work Order

1. Resolve content provenance before putting any existing prompt, image, PDF, key, or source bundle in a public branch, issue, PR, or artifact.
2. Implement the shared activity workflow using only cleared content. A shell using newly authored demonstration content can be developed separately while provenance review is pending.
3. Pilot the actual release candidate on managed school devices and complete the Classroom download/upload round trip before class-wide use.
4. Use pilot evidence to choose later improvements. Automatic grading and Learning Compass integration remain later phases.

## Preservation Checkpoint

- Decisions and discussion are recorded without including proprietary source text, answer keys, student data, or private recovery identifiers.
- The existing D01 preview, conversion source, teacher guide, R05 packet/source bundle, and validation record are retained in the private recovery checkpoint.
- The historical Google Forms recommendation is marked superseded.
- The public repository has no student activity code or deployment introduced by this checkpoint.
- No release, build version, grading rubric, or Learning Compass interface is invented here.

## Resume Instructions

Read this file, DECISIONS.md, AGENTS.md, and the selected issue. Retrieve the owner's private recovery checkpoint only when source review or implementation requires it. Do not publish that archive or quote its unreviewed contents into a public issue. Work on one bounded task and report the actual validation performed.

## Current Handoff

The provenance selection is merged. Issue #2 adds the reusable interface, protected draft recovery, separate per-part JSON/text submissions, and First Light build identity. See [Verification](VERIFICATION.md) for the actual tested build.

Next is [issue #3](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/3): choose hosting, verify the selected lever game against the activity on managed school devices, and complete a real download → attachment → Turn In round trip. Preserve the difference between browser automation and a school-device trial. Automated grading, imports, and class-wide release remain outside this PR.
