# Decisions And Discussion

Conversation checkpoint: September 28, 2026. This is a project handoff, not a transcript or a claim that the planned system already exists.

## Agreed Direction

| Decision | Meaning |
| --- | --- |
| Use a hybrid classroom workflow | Move suitable packet work to digital delivery while keeping useful standard sheets and selected hands-on or drawing work on paper. |
| Preserve the custom HTML approach | Build on the activity interface already reviewed with the owner. |
| Host cleared student activities on GitHub Pages | Use the new ClassroomActivities repository as their shared home. |
| Submit downloaded answers through Google Classroom | Students download an answer file and manually attach it to their Classroom assignment. |
| Keep the project separate from EES | Use one repository for multiple activities and assessments across courses and years, rather than adding another system inside the crowded curriculum repository or creating a repository per worksheet. |
| Plan for future grading and Learning Compass | Preserve the ability to automate suitable checks and later import results; these integrations are future work. |
| Protect instruction time | Address observed academic dishonesty without designing the entire learning experience around surveillance or preventing every possible misuse. |
| Preserve first | This work session records the decisions and discussion and saves recovery material before implementation continues. |

## Owner's Content Restriction

No PLTW material copied from my.pltw.org may be put on the open internet. Independently authored work inspired by the subject matter may be shared, but it must not distribute copies of PLTW work or represent itself as PLTW.

The repository is public. This restriction applies before uploading to any branch, issue, PR, attachment, release, artifact, or website. Unreviewed content stays in the existing private workspace and saved materials.

Original authorship or distribution rights must be established for both text and images. The prior draft uses illustrations cropped from the locally prepared R05 packets; that conversion history alone does not establish clearance. Preserve the draft privately while reviewing its upstream sources. The checkpoint does not declare the draft infringing or cleared.

Teacher answer keys and identifiable student work also stay outside the public repository. A disclaimer cannot replace content review.

## Classroom Context Reported By The Owner

- Students already use computers extensively and are accustomed to Google Classroom.
- Backup laptops and chargers are available.
- The owner arranged for the existing GitHub Pages sites to be allowed by the school's technology team.
- Blocksi is available, although the owner is still learning it.
- The connected personal account is separate from the school Google Classroom account. School-account connection is deferred pending the owner's discussion with the technology team.
- Printing long class sets takes time and makes corrections expensive.

These are planning inputs, not verification that the new activity URL, downloads, local saving, or submissions work on a managed student device.

## Discussed Design To Carry Forward

These points capture the proposed design; exact interfaces and data contracts remain to be finalized in implementation.

- Keep each prompt, illustration, and answer field together. A separate game plus this activity should avoid a third question-only document.
- Reuse a shared activity interface, styles, navigation, saving, and export logic, with separate definitions/assets for individual activities.
- Keep curriculum repositories as the home for curriculum planning and appropriate private source material. Existing games retain their repositories. Learning Compass is a downstream consumer.
- Prefer one canonical editable source for each activity's content. Generating print and digital editions from common definitions is a future possibility, not implemented synchronization.
- Use stable activity and question IDs, activity revision, and submission-schema version. Consider student name/bell, application build identity, and export time in the final schema.
- Use a structured JSON answer submission that later tools can import, with a readable companion export. The current prototype's JSON is only a portable draft format.
- Separate prediction from observation. Keep explanations, sketches, and open designs; do not eliminate them to make grading easier. Predictions should not be correctness-graded.
- Support browser draft saving and a portable backup. Make the difference between saving a draft, downloading an answer file, and turning in through Classroom clear.
- Preserve the student's own earlier responses beside later questions when needed. The lever prototype includes an earlier-trial reference to reduce window switching.
- Split answer exports by assigned part and prevent unrelated activities/revisions from overwriting each other's drafts.
- Check numeric equivalence and valid relationships when grading is eventually built; no final rubric or scoring policy has been adopted.

## Preserved Prototype Status

The private D01 lever preview carries both R05 core parts: 14 questions, 95 labeled response controls, 14 embedded figures, and 20 prediction fields. Forty-eight fields were identified as candidates for later fixed-answer checks; no automatic grader is implemented.

Implemented in that draft: question navigation, local browser saving, a text response download, portable JSON draft save/restore, and an inline reference to a student's earlier responses. Its text export currently includes both parts. Its storage and export formats are prototypes.

The student HTML contains no answer key. The separate conversion JSON and teacher guide contain expected answers and must remain private. The source archive also contains packet PDFs and source material that must not be uploaded wholesale.

Prior checks covered JavaScript syntax, unique labels/controls, reviewed diagram crops, and selected behaviors using a mock DOM. Full rendered browser review, a complete live game playthrough, and a managed school-device trial remain outstanding. Prior testing was not a copyright/provenance review.

## Superseded And Deferred Ideas

The earlier teacher guide proposed native Google Forms. The owner's later choice of custom HTML, GitHub Pages, and downloaded answer submissions supersedes that delivery proposal. Preserve the historical guide as evidence, not as current setup instructions.

Deferred: automated grading, Learning Compass import, direct school-account integrations, embedded game integration, print/digital generation from a common source, digital sketch uploads, and broader activity migration. These are not promises of present functionality.

## Issue #2 Implementation Decisions

- Issue #1 cleared the selected content in `content/levers`, now consumed unchanged by the shared renderer. The private draft remains excluded.
- Name and Bell carry forward the reviewed prototype's identity fields. Both are required for submissions; unfinished draft backups may leave them blank.
- Draft schema 1 and submission schema 1 are separate contracts. Per-part JSON and readable text share one frozen submission object. Missing answers are explicitly recorded; students can intentionally download an incomplete part.
- Activity/revision/content-fingerprint-qualified storage and strict restoration prevent changed prompts from inheriting old answers. No implicit migration is implemented.
- The owner selected **First Light** for development version **0.1.0**, the shared-workflow milestone. The app uses a dependency-free shared HTML/CSS/JavaScript shell, separate activity definitions, and immutable build metadata.
- The added saving-practice activity is newly authored workflow content with no curriculum source.

See [Drafts And Answer Files](ANSWER_FILES.md), [Build Identity](BUILD_IDENTITY.md), and [Verification](VERIFICATION.md) for exact contracts and observed results. Earlier checkpoint/prototype descriptions above are historical, not current verification claims.

## Remaining Decisions

- Hosting configuration and the exact build/game pairing for the managed-device pilot.
- School-device download/upload constraints and student-facing improvements found in issue #3.
- Future grading rubric, import interfaces, and reviewed migration policy for assigned content revisions.
