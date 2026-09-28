# Drafts And Answer Files

## Student Workflow

Enter **Name** and **Bell**, then work in the assigned part. Predictions have their own gold panels and remain separate from observations; retain the first prediction when retrying. Paper sketches stay on paper. A confirmation records completion, not an uploaded drawing or a grade.

**Download Draft Backup** saves both parts and navigation for later restoration. **Prepare Part Submission** checks Name/Bell, lists unanswered fields, and freezes one part's answers. The JSON and readable text buttons in that window both use that same snapshot. After editing, prepare a new snapshot. A student can deliberately download an incomplete submission; its missing response IDs and status remain explicit in both formats. Completion means fields are filled, not that answers are correct.

In the assigned Google Classroom task, choose **Add or Create**, **File**, select the answer JSON (and readable text if requested), wait for the attachment, then choose **Turn In**. Check the Classroom status. Downloads here never submit work automatically. If a managed device rejects JSON, keep both files and report the restriction during the pilot; the readable text retains the same answers and metadata. Do not rename a backup into a submission.

## Identity And Compatibility

| Identity | Meaning |
| --- | --- |
| `activity_id` | Stable activity identifier, unrelated to title spelling. |
| `content_revision` | Editorial revision, currently `C01`. Change for intentional content edits. |
| `fingerprint` | SHA-256 of the exact UTF-8 content-file bytes. A second safeguard against a changed prompt using an unchanged revision. |
| Question / response IDs | Stable semantic identifiers; never reuse an old ID for a different question, trial, purpose, or answer. |
| Draft schema 1 | Editable work backup; not a submission. |
| Submission schema 1 | One immutable exported part plus metadata; not importable as a draft. |
| Application version | Development `0.1.0`, milestone **First Light**; independent of content/schema revisions. |

Storage keys include draft schema, activity ID, revision, and fingerprint. Any content-byte change creates a separate storage namespace, even whitespace-only edits. Old namespaces are retained. When earlier versions are found, the interface explains the separation and offers an **Other Saved Versions** recovery download; old answers are never silently put onto new prompts. This conservative policy favors recoverability over automatic migration: retain old published activity versions when revising assigned work, and provide a deliberate reviewed migration later. Renaming a title or changing a prompt does not relabel saved answers.

Portable restoration requires an exact identity/fingerprint and schema match, all expected response IDs, valid value types/choices, and no unknown fields. The user sees whose backup it is and confirms replacement; a backup button preserves current work first. D01 prototype files, submission files, incompatible revisions, malformed JSON, excessive text, and files larger than 4 MiB are rejected without changing answers. No automatic migration is implemented.

## Draft Schema 1

`kind` is `classroom-activity-draft`. Required properties are `draft_schema_version`, `activity` (`id`, `revision`, `fingerprint`), `student` (`name`, `bell`), `answers` (response-ID map), `navigation.question_id`, and `updated_at` (ISO date). Draft identity may be blank. Each text/choice/number answer is a string; each sketch confirmation is a boolean. Blank strings and false confirmations are incomplete. Numeric text is preserved as entered, including units or fractions; numeric equivalence and grading are deferred.

Maximum text length per response is 10,000 characters, Name 120, Bell 40. Drafts contain no expected answers. Name and Bell carry forward the reviewed prototype's fields; school IDs, emails, signatures, and account connections are not requested.

## Submission Schema 1

`kind` is `classroom-activity-submission`. The shared model creates these properties:

| Property | Contents |
| --- | --- |
| `submission_schema_version` | Integer `1`. Future breaking schema changes require a new version. |
| `submission_id`, `exported_at` | UUID and ISO UTC timestamp minted once when preparing the snapshot. |
| `activity` | `id`, `revision`, `fingerprint`, and readable `title`. |
| `part` | Assigned part `number` and `title`. |
| `student` | Name and Bell; both required for submissions. |
| `build` | Complete embedded build manifest; source previews explicitly identify themselves as unbuilt. |
| `completion` | `status`, `answered`, `total`, and `missing_response_ids`. |
| `responses` | Ordered records for this part only: question ID/number/title; response ID; label; kind; purpose; value. |

`purpose` distinguishes `prediction`, `response`, and `sketch`; original content uses `response` for observations and other written work. `kind` is `choice`, `number`, `paragraph`, or `confirmation`. The Q11 on-screen Q7 reference is a view of this student's earlier answers, not a hidden key or an extra copy in the Part 2 submission. Submit Part 1 separately when assigned.

The readable text is generated exclusively from the submission object, includes every response ID/value/purpose/kind, and shares the same submission ID, content fingerprint, build ID, time, completion status, and identity. Filenames distinguish `DRAFT`, `ANSWERS`, and `READABLE`. No grading or Learning Compass import contract is promised beyond this documented versioned envelope.

## Saving And Recovery

Autosave writes on each input and navigation change. Saving is local to this browser profile and website origin; a moved site, cleared browser data, private session, or a different device needs a portable backup. A shared device retains the displayed student's draft until **Start New Draft** explicitly clears it. Download work before clearing; other activities/revisions are unaffected.

Read failures and quota/write failures keep in-memory answers and show a persistent warning. Corrupt or incompatible saved data is left untouched with a raw recovery download. The store checks the previously read value before writing, and a storage event pauses saving when another tab changes the draft. This catches stale tabs; localStorage is not a multi-user database or a transaction system. Keep one editing tab per activity. If saving pauses, back up the open work before reloading or deliberately starting anew.

There are no analytics, student-data requests, external fonts, or school-account APIs. Public hosting still receives normal page/content requests. Student files belong in the teacher's Classroom assignment, never a public repository or issue. All checked-in examples and browser tests use fictional data.
