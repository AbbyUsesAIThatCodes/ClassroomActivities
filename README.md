# Classroom Activities

A shared home for independently authored classroom activities across courses and school years.

**Current Status:** `0.1.0 First Light` is a development candidate for the owner-led classroom pilot. The cleared lever content and a short saving-practice activity run in a common student interface. The Pages workflow publishes verified builds after merge to `main`; this PR does not merge or deploy them. School-device and Google Classroom acceptance remain open in issue #3.

The student workflow is: open the assigned activity, enter Name and Bell, work with prompts and answers together, keep the separate game open when needed, download the assigned part's answers, and manually attach the file to Google Classroom.

## Run And Review

Node 22+ and Python 3 are sufficient; the student app has no third-party runtime dependencies.

```sh
npm test
npm run verify:content
npm run build
npm run serve
```

Open the source preview at `http://127.0.0.1:4173/`, or the exact `dist/<identifier>/` folder printed by the build. A source preview explicitly says it is unbuilt. Each real build has an immutable manifest and full visible identifier. Use an HTTP server or HTTPS hosting; opening files directly is unsupported.

Activities use stable query links such as `?activity=levers-load-effort-distance&part=1`. The content catalog is `content/activities.json`; the shared renderer, draft model, storage handling, and styles live in `src/`. Add independently authored, reviewed definitions and assets without duplicating the interface.

- [Drafts And Answer Files](docs/ANSWER_FILES.md): schemas, recovery, student steps, and compatibility.
- [Build Identity](docs/BUILD_IDENTITY.md): allocation, provenance, and location inventory.
- [Verification](docs/VERIFICATION.md): actual review build and completed checks.
- [Pilot Procedure](docs/PILOT.md): activity/game links, managed-device steps, Classroom round trip, and paper fallback.
- [Pilot Results](docs/PILOT_RESULTS.md): evidence and owner sign-off; pending checks stay explicit.
- [Content Provenance](docs/CONTENT_PROVENANCE.md): selected lever material and public boundary.
- [Classroom Artwork](docs/CLASSROOM_ART.md): pastel course graphics, selected sources, credits, and regeneration.
- [Decisions And Discussion](docs/DECISIONS.md): agreed direction and implementation decisions.
- [Roadmap](docs/ROADMAP.md): bounded phases and the next school-device pilot.
- [Contributor Instructions](AGENTS.md): working rules.

## Content Boundary

This repository is public. Do not upload PLTW PDFs, copied text, screenshots, images, answer keys, or other material obtained from my.pltw.org. Public activities must use independently authored content and assets cleared for public distribution. This project is independently developed and is not an official PLTW product or representation of PLTW.

Unreviewed drafts, teacher keys, student submissions, and private source archives stay outside this repository, including issues, PRs, branches, attachments, build artifacts, and deployed pages. No grading, Learning Compass integration, Google Forms dependency, school-account connection, or direct Classroom API is implemented.
