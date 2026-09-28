# Reviewed Lever Content

This is the student content selected for publication in [issue #1](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/1). It is ready for the shared activity implementation in [issue #2](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/2). It is not a running application or a classroom release.

The activity is independently developed for AbbyUsesAIThatCodes with AI assistance. It is not an official PLTW product and does not imply affiliation or endorsement.

## Start Here

| File | Purpose |
| --- | --- |
| [student-content.json](student-content.json) | Canonical student-only wording, response labels and choices, sketch directions, and diagram references. |
| [PROVENANCE.json](PROVENANCE.json) | Publication decisions for every question and image, with hashes of the selected bytes. |
| [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) | Artwork lineage and dependency/licensing scope. |
| [Content Provenance Review](../../docs/CONTENT_PROVENANCE.md) | Review conclusion, exclusions, validation, and implementation handoff. |

The selection contains **14 questions**, **95 response controls** (93 fields and two paper-sketch confirmations), **20 prediction fields**, and **14 diagrams**. Part 1 contains Questions 1–8; Part 2 contains Questions 9–14. Expected answers, scoring categories, and completed trial records are absent.

## Implementation Contract

- Treat `student-content.json` as the canonical editorial source. `reviewed-student-content-v1` describes this content inventory; it is not the future submission or browser-storage schema.
- Preserve the activity ID, question IDs, and response IDs when defining the production contract. Qualify them with the activity and content revision. `C01` is a content revision, not a software build identifier, and old prototype drafts must not be silently imported as compatible submissions.
- Keep each question's blocks in order. A prediction and its later result are separate responses. Preserve the original prediction on retries; predictions are not correctness-scored.
- The `student-response-reference` block in Question 11 displays only that student's Question 7 responses. Its fallback directions let the student repeat a trial. Do not fill missing responses with an expected result.
- The `sketch` blocks retain paper drawing and a completion confirmation. No drawing upload or automatic sketch grading is specified here.
- Render named game controls in **bold**, using the exact names **Reset**, **Hold Level**, **Release**, **Hide Math**, **Show Math**, **Controls**, **Side View**, and **Swap Positions**. Do not shorten or rename them.
- Render instructional vocabulary in **bold plus underline**, including load, effort, fulcrum, lever, force, mass, weight, arm distance, load distance, effort distance, load mass, effort mass, effort force, first-class lever, ideal mechanical advantage, and IMA. Preserve complete button labels before styling vocabulary inside ordinary prose. Use Title Case for interface headings.
- Preserve image descriptions. Do not infer unknown masses from drawing size or provide filled-in dimension labels. The archived drawings omit the game's later balance pointer; they illustrate the specified level setup rather than every current game feature.
- Build the renderer, draft recovery, per-part submissions, readable export, and Build Identity in issue #2. The content bank makes no claim that any of these already works.

## Check The Selection

From the repository root:

```sh
python3 scripts/verify_lever_content.py
```

The check detects changed selected bytes, missing or unexpected files, duplicate IDs, broken references, and fields outside the student-only format. It does not establish authorship by itself. Review changed or new material before publication, update the inventory deliberately, and record a new content revision when warranted. Merely updating hashes does not clear content.
