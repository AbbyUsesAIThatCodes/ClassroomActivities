# Lever Activity Classroom Pilot

**Status: Awaiting Owner-Led School Testing.** This is the procedure for [issue #3](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/3), not a completed pilot or class-wide release. Use [Pilot Results](PILOT_RESULTS.md) to record evidence. Merging the preparation PR must not close the issue.

## Start Here

1. Merge the preparation PR when ready. In Actions, wait for **Publish Pilot To Pages** to finish successfully. The repository's Pages source must remain **GitHub Actions**. A successful build alone is not a deployment.
2. Open the activity and game below on a managed student device, on the school network, with the normal Blocksi session/settings. Do not disable restrictions for the test. Check every diagram and the actual interactive game, not only the home pages.
3. Copy both full visible build identifiers into the results form. If either changes during testing, record the new pairing and repeat the affected checks. The game's source commit and the activity content revision are not substitutes for these build identifiers.
4. Use an authorized school practice workflow with fictional identity **Practice Student**, Bell **2**. Keep actual student work and account details inside the school's approved system. The assistant must not connect to the school account while that connection remains deferred.

## Pilot Links

| Destination | URL And Purpose |
| --- | --- |
| Part 1 | [Questions 1–8](https://AbbyUsesAIThatCodes.github.io/ClassroomActivities/?activity=levers-load-effort-distance&part=1) |
| Part 2 | [Questions 9–14](https://AbbyUsesAIThatCodes.github.io/ClassroomActivities/?activity=levers-load-effort-distance&part=2) |
| Saving Practice | [Short Workflow Practice](https://AbbyUsesAIThatCodes.github.io/ClassroomActivities/?activity=workflow-practice) |
| Companion Game | [Levers: Load, Effort, and Distance](https://AbbyUsesAIThatCodes.github.io/LeversLoadEffortDistance/) |

The activity links are planned deployment destinations until the Pages job succeeds and they open on the managed device. The companion is **Levers: Load, Effort, and Distance**; the similarly named Mechanical Advantage game has different controls. Keep the game in a second tab. Use side-by-side windows only when both remain readable.

## Run The Student Workflow

| Check | Action And Observable Pass Condition |
| --- | --- |
| Open And Read | Open both assigned part links and the game. Check all 14 diagrams, including their labels, at normal classroom zoom. No failed images or overlapping fields; prompts and answers stay together. |
| Keyboard And Numbers | Use Tab, Shift+Tab, Enter, and arrow keys where appropriate. Enter Name/Bell, a prediction, numeric text, and an explanation. Open/close the submission dialog and navigate between questions. Focus remains visible and all required controls can be reached. |
| Full Live Playthrough | Work through every question using the game, following the question's **Reset**, **Hold Level**, and **Release** directions. Use **Hide Math** for predictions where directed. Record each first prediction before testing and keep it after retries. Mark Q1–Q14 individually in the results form; retain completed answers only in the school system. |
| Part Continuity | Switch between game and activity, between questions, and between parts. In Q11 confirm that the displayed Q7 values are your own recorded trial. Part 1 stays intact while working in Part 2. |
| Local Resume | Download a draft backup, close the activity tab, reopen the same activity in the same managed browser profile, and check identity, prediction, observation, and a later answer. Repeat after a browser restart if school policy permits. |
| Device Change | On Device A, choose **Download Draft Backup**. Move that JSON through a school-approved method. Open the same activity/revision on Device B, choose **Restore Draft Backup**, check the identity shown, and confirm. Verify answers from both parts, separate prediction/result values, and navigation. Back up any existing Device B work before replacing it. |
| Both Part Exports | For each part, choose **Prepare Part Submission**, then download both the answer JSON and readable text from the same dialog. Check that the two files share the submission ID, activity/revision/fingerprint, part, build, and export time. Part 1 contains Q1–Q8 only; Part 2 contains Q9–Q14 only. Missing work is explicitly reported. |
| Failure Recovery | In a disposable practice draft, try restoring an answer submission and a plain-text file saved with a `.json` extension. Both should be rejected and existing work preserved. If saving or downloads fail under school policy, record the exact message privately, keep the tab open, and follow the fallback below. Do not change managed settings to force a result. |

Browser automation can exercise these mechanisms; it cannot establish that school profiles, file pickers, downloads, Blocksi, or transfers between physical devices allow them.

## Complete The Classroom Round Trip

Use only the owner's authorized school workflow. Do not create a new school account, impersonate a student, or connect a personal account as a workaround. If student-role testing is unavailable, mark this check **Blocked** until an approved route is available.

1. In the designated practice assignment, attach the Part 1 **ANSWERS** JSON and its **READABLE** text using **Add or Create → File** (or the equivalent current Classroom labels). Wait for both attachments, then **Turn In**. A downloaded file or visible attachment alone does not complete this step.
2. Confirm the student view shows the assignment as turned in. Record only pass/fail in the public results; keep screenshots containing names, class codes, assignment links, or account details private.
3. From the teacher's normal authorized view, open/download those exact submitted files. Verify the fictional Name/Bell, activity `levers-load-effort-distance`, revision `C01`, fingerprint, part number, matching submission ID, and full activity build identifier. Read several responses, including a prediction and later result. Check the readable file is useful without a special importer.
4. Repeat for Part 2 using the intended separate-part assignment workflow. Confirm the two parts were not confused, overwritten, or submitted as a **DRAFT** file. Keep paper sketches with the matching name, bell, part, and question number.
5. If JSON or text is blocked, retain the files and record the restriction. Do not disguise a blocked file with a different extension. A teacher-approved readable-text workaround can preserve today's work, but mark the planned JSON round trip **Blocked** until resolved or the owner explicitly revises the requirement.

## Paper Sketches And Interruptions

- Q8 and Q14 keep their paper sketches. A checked sketch box records completion; it does not upload the drawing. Label and collect sketches through the normal classroom process.
- Before a bell change or device swap, download a **DRAFT** backup. Local saving belongs to one browser profile and site origin; signing in on another computer does not move it.
- If an activity tab still works after a connection failure, keep it open and try a backup. The app is not an offline-installable application; do not reload expecting offline support.
- If the device, game, or downloads fail, record responses on paper with name, bell, part, question number, and response label. Keep first predictions separate from later observations. Record the last completed trial and setup so work can resume. Do not invent game observations when the simulation is unavailable.
- If Classroom fails, retain the downloaded files in a school-approved location and submit when the teacher directs. Never put real student work in a GitHub issue, PR, or public attachment. A backup is not a completed turn-in.
- On shared devices, verify the displayed Name/Bell before editing. Use **Start New Draft** only after the prior work has been preserved according to school policy.

## Release Gate

The owner reviews the results form. Resolve any blocker that prevents access, changes intended measurements, loses work, mixes students/parts, or prevents teacher review before class-wide assignment. Log the symptom, expected behavior, actual behavior, build pairing, and the retest result; use fictional examples in public.

Close issue #3 only after all five acceptance conditions are supported: managed-device evidence and exact identities; successful download/upload/teacher review; demonstrated close/reopen and cross-device resume; no unresolved important blockers; and public evidence containing only fictional data. No score, grade, or automatic Classroom submission is produced by this pilot.
