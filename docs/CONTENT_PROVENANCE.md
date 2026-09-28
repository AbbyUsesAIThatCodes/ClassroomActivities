# Lever Content Provenance Review

Review date: September 28, 2026. Task: [#1](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/1).

## Decision

The selected **14 core questions and 14 student diagrams** have a documented basis for publication as independently authored project content. The exact selection is in [content/levers](../content/levers/README.md); [PROVENANCE.json](../content/levers/PROVENANCE.json) identifies every question, its response IDs, each image, their authorship/origin, and their publication decision. The content file and image hashes bind this review to the selected bytes.

This is a bounded content review. It does not approve a source archive wholesale, release an application, or certify a classroom workflow. Material outside the inventory remains unselected; unresolved material stays private.

## Review Basis

- Reviewed all selected prompt wording, explanatory text, labels, choices, and sketch directions. Considered wording, distinctive scenarios, instructional structure, and numerical setups, as well as exact-text overlap. The selection is a set of independently composed investigations of the owner's game; standard lever facts, formulas, and terminology are not claimed as original inventions.
- Inspected all fourteen student diagrams and traced their shapes through the rendering records, four model components, and the upstream procedural apparatus source. Confirmed the model component hashes and inspected the predecessor beam/support geometry. The selected images use project geometry and annotations, without importing publisher illustrations or VEX CAD assets.
- Reviewed the applicable upstream notices and the scope of geometry, rendering-tool, and font use. [Lever Content Notices](../content/levers/THIRD_PARTY_NOTICES.md) distinguishes rendered output from software/font redistribution and preserves the useful public lineage.
- Prepared the student selection using an explicit field allowlist. Expected answers and scoring classifications were not copied. A previous draft or conversion file is not itself the publication source for future implementation.
- Newly authored the opening directions and independent-authorship statement. Removed the prototype's course-number/review-banner framing from the selected content. Preserved the two-part sequence, original response IDs, prediction/observation separation, paper sketches, and the student's own earlier-response reference.

Detailed source comparisons and private recovery references are deliberately outside the public record. This conclusion rests on the inspected selection and its authorship evidence, not on a disclaimer or an automated similarity score alone.

## Publication Boundary

| Material | Decision |
| --- | --- |
| Student wording, response labels, choices, and sketch prompts listed in the inventory | Selected for publication. |
| Fourteen PNG diagrams listed by path and hash | Selected for publication with the recorded authorship and lineage. |
| Opening directions and independent-authorship statement | Newly authored and selected for publication. |
| Expected-answer data, teacher guides/keys, grading tables, or completed example responses | Excluded from the public selection. |
| Source PDFs, archives, original conversion JSON, prototype HTML/scripts, private source notes, and recovery identifiers | Excluded; do not upload or use them as public evidence. |
| Optional exercises, separate vocabulary companion, other upstream models/assets, and newly added material | Outside this review; require their own selection and review before publication. |
| Student records and submissions | Never part of this public content inventory. |

The student bank provides instructions and blank response definitions. Instructional facts and formulas remain visible where teaching requires them; it contains no hidden expected-answer fields or grading key.

## Verification

- Checked the inventory against all 14 questions, 95 response controls, 20 prediction fields, two parts, and 14 images.
- Checked selected PNGs visually, including blank dimensions and illustrative unknown-mass drawings, and checked their image chunks for hidden text metadata.
- Checked the student data recursively against an explicit allowed-field format, including the reference from Question 11 to Question 7.
- Checked hashes, relative asset references, duplicate IDs, unlisted files, and the publication diff for source archives, answer-bearing data, private identifiers, and unintended files.
- Checked that the review's files can coexist with the separate preservation PR #4; this task does not merge or overwrite it.

Run `python3 scripts/verify_lever_content.py` to repeat structural and exact-byte checks. The verifier deliberately fails if reviewed bytes change. It cannot establish the provenance of new material or replace a review.

No browser application, software build, release identifier, deployment, full live-game playthrough, or managed-device/Classroom test is produced or claimed here. The drawings predate the balance pointer. Before implementation is assigned broadly, confirm the instructions and diagrams against the chosen game build and complete issue #3's pilot.

## Handoff To Issue #2

Use the checked-in student content and assets as the implementation input. Read [the content contract](../content/levers/README.md) before mapping it into a renderer. Define the production draft/submission formats separately; `C01` is only the content revision. Retain the separate prediction fields and the student's own earlier results. Keep teacher material outside public Git history and browser output.

If content changes, review the changed text/assets and record the new decision before updating hashes. Do not recover missing content by uploading a whole earlier draft. Implementation, Build Identity, submissions, and the school-device pilot remain the next bounded tasks.
