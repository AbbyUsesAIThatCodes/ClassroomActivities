# Pilot Results

**Decision: Not Yet Ready For Class-Wide Use.** Preparation and automated checks do not complete [issue #3](https://github.com/AbbyUsesAIThatCodes/ClassroomActivities/issues/3). Fill this record from observed results, using **Pass**, **Fail**, **Blocked**, or **Not Run**. Never treat an empty checkbox as a pass.

## Preparation Observations

- The activity root returned HTTP 404 on September 29, 2026 at 00:06 UTC (September 28 in Cincinnati). Main had the verification workflow but no Pages publishing workflow. This PR adds deployment after merge; an actual deployment is still unverified.
- The companion game's public `build-manifest.json` was retrieved successfully during the same session. It reported `0.1.0_Integrated-Core_main_build-001_20260928T172154Z_g98c9783f8c10_web`, source `98c9783f8c108fffe345dc2613d7b0818c60f76f`, and build UTC `2026-09-28T17:21:54.837Z`. This establishes a candidate game identity, not a completed playthrough or managed-device result.
- Live browser interaction did not complete in this session. No live game playthrough, school login, managed-device test, or Classroom upload/teacher review is claimed.
- See [Verification](VERIFICATION.md) for completed repository checks and review build identity. Follow [Pilot Procedure](PILOT.md) after a successful deployment.

## Owner-Led Session

| Field | Observed Value |
| --- | --- |
| Session Date And Time Zone | Pending |
| Tester Role | Pending; no student's real name in this public record |
| Device A Model, OS, Browser Version | Pending; omit asset tags/account identifiers |
| Device B Model, OS, Browser Version | Pending |
| Normal School Network / Blocksi Session Used | Pending; do not include credentials or private configuration |
| Activity URL And Full Visible Build ID | Pending; confirm the deployed candidate, not the local review build |
| Activity ID / Content Revision / Fingerprint | Expected ID `levers-load-effort-distance`, revision `C01`; copy actual fingerprint from the answer file |
| Game URL And Full Visible Build ID | Pending; recheck the candidate above at testing time |
| Assignment Workflow | Pending; describe separate-part process without a private link/class code |
| Private School Evidence Location | Retain inside the approved school system; do not paste private links here |

## Required Results

| Check | Result | Observation / Blocker / Retest |
| --- | --- | --- |
| Activity And Game Open Under Normal School Controls | Not Run | |
| All Diagrams, Layout, Zoom, Keyboard, Numeric Entry | Not Run | |
| Full Live Game Playthrough, Q1–Q14 | Not Run | |
| Tab/Part Switching And Q7→Q11 Reference | Not Run | |
| Save, Close, Reopen, Browser Restart If Permitted | Not Run | |
| Draft Download And Restore On Device B | Not Run | |
| Part 1 JSON And Readable Export Pair | Not Run | |
| Part 2 JSON And Readable Export Pair | Not Run | |
| Invalid Restore Rejected Without Losing Work | Not Run | |
| Student Attachment And Turn In, Both Parts | Not Run | |
| Teacher Opens Submitted Files And Checks Identity/Responses | Not Run | |
| Q8/Q14 Paper Sketch Collection And Interruption Fallback | Not Run | |
| Important Blockers Resolved And Retested | Not Run | |
| Public Evidence Contains Only Fictional Data | Not Run | Review the filled record before publishing |

Full playthrough coverage (record usability/setup problems, never answer-key values):

| Question | Result | Question | Result |
| --- | --- | --- | --- |
| Q1 | Not Run | Q8 | Not Run |
| Q2 | Not Run | Q9 | Not Run |
| Q3 | Not Run | Q10 | Not Run |
| Q4 | Not Run | Q11 | Not Run |
| Q5 | Not Run | Q12 | Not Run |
| Q6 | Not Run | Q13 | Not Run |
| Q7 | Not Run | Q14 | Not Run |

## Acceptance And Sign-Off

| Issue #3 Acceptance Condition | Evidence Required | Status |
| --- | --- | --- |
| Managed-Device Results And Exact Identities | Session fields plus access/usability/playthrough rows | Pending |
| Download/Upload/Teacher Review Round Trip | Both part exports, Turn In, and teacher review rows | Pending |
| Student Can Resume Or Change Devices | Close/reopen and Device B rows | Pending |
| Important Blockers Resolved | Public-safe blocker descriptions and retest results | Pending |
| Fictional Public Evidence; Student Work Stays In School System | Owner's review of the filled record | Pending |

Owner decision: **Pending**. Date: **Pending**. Remaining blockers: **School-device pilot and Classroom round trip have not run.** Keep issue #3 open until the evidence supports closure.
