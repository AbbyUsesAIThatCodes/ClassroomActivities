# Build Identity

## Release And Scope

The owner selected **First Light** for the first shared-workflow milestone, development version **0.1.0**, on September 28, 2026. The name applies to `0.1.x`; it is a milestone convention, not an automatic meaning of SemVer's minor field. `release.json` is authoritative. Schema compatibility is documented in [Drafts And Answer Files](ANSWER_FILES.md). Activity content revisions do not follow application version numbers.

Canonical pattern: `VERSION_CODENAME_SCOPE_build-NNN_UTC_gREVISION[-dirty-FINGERPRINT]_web`. The manifest retains the full revision, exact UTC timestamp, source dirty state, and SHA-256 input fingerprint. A dirty build is explicitly local. The current review build and completed checks are recorded in [Verification](VERIFICATION.md); this PR does not deploy a build.

## Commands

With Node 22+ and Python 3, use `npm test`, `npm run verify:content`, and `npm run build`. No runtime package install or bundler dependency is needed. The source preview (`npm run serve`) is labeled **Development Source · Unbuilt**. To inspect a real build, serve the repository and open the exact generated `dist/<identifier>/` path. Keep that directory together; an existing artifact is reused without renaming or regenerating its manifest.

Before a PR exists or shared allocation is unavailable, `npm run build` uses a random session-specific `local-*` scope persisted under `.local-builds/session.json`. Atomic exclusive file creation reserves increasing local ordinals under `.local-builds/<scope>/`. New workspace sessions get distinct scopes. Retain that directory for repeated local builds; explicitly setting `LOCAL_BUILD_SCOPE` requires retaining its ledger and avoiding reuse in another workspace. Local reservations are not PR build numbers.

For a real, open, same-repository PR, use a clean PR head checkout and set `GITHUB_REPOSITORY` and a suitably scoped `GITHUB_TOKEN` in the environment (never committed). Run `npm run reserve:build -- pr-<actual-number>`. It verifies the PR head and creates `reservations/pr-N/NNNNNN.json` on the durable `build-ledger` branch through the GitHub Contents API. Creation omits an update SHA: concurrent callers cannot overwrite the same slot; a conflict advances to the next ordinal. All local and CI PR builds must use this one allocator. Failed attempts retain their reservations and gaps.

Run the returned `npm run build -- --reservation reservations/pr-N/NNNNNN.json` command. The build fetches the public ledger, checks the clean source matches, and creates a unique durable `claims/pr-N/NNNNNN.json` before producing files. Reuse of a reservation fails; allocate a new one after any failed/finished invocation. Build time is captured once for the claimed manifest immediately before metadata injection; completion is logged separately. A claims-creation failure produces no artifact. Without shared credentials, continue with an explicitly local scope, never a fabricated PR ordinal.

The code uses PR head commits, not synthetic merge refs; independently built targets would need their own recorded target. Only the web target exists. No automated build, deployment, IDE export, native executable, or stable release is claimed by this task. The test-only CI workflow creates no artifact or build identity.

## Location Inventory

| Surface | Implementation | Status |
| --- | --- | --- |
| Release record | `release.json`; package version | Implemented, `0.1.0 First Light` development |
| Allocation | `scripts/reserve-build.mjs`, `build-ledger` branch; local exclusive files | Implemented; concurrent PR allocation tested with a simulated API; live PR allocation not exercised in this task |
| Immutable manifest | `scripts/build.mjs` → artifact `build-manifest.json` | Implemented; one timestamp and fingerprint |
| Build console | `BUILD START`, `BUILD SUCCESS` / `BUILD FAILED` | Full unchanged identifier |
| Artifact name | `dist/<full-identifier>/` | Implemented; no generated bundles committed |
| Student UI | `src/app.js` → `index.html` footer `#build-id` | Full ID, wrapping and selectable |
| Answer files | `src/model.js` submission `build`; readable export | Same embedded manifest / identifier |
| Artifact documentation | Generated `BUILD.md` | Derived from manifest |
| Review evidence | `docs/builds/` retained manifests; `docs/VERIFICATION.md` | Current review plus historical attempts |
| Contributor guidance | `AGENTS.md`, PR template, README | Links to this inventory |
| Deployment identity | None | Deferred to the school-device pilot/release task |

`BUILD_REPORT_DIR` can place generated manifest/report pairs in a chosen review directory. Reports are not build inputs. Committing evidence does not require rebuilding an unchanged artifact. The source fingerprint covers `index.html`, `src/`, `content/`, release/package records, the builder/allocator, explicit publication allowlist, and provenance verifier, with sorted paths and exact bytes. Evergreen documentation points at verification rather than hand-maintaining a second current timestamp.
