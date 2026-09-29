# Digital Classroom Artwork

The owner requested this pastel rainbow refresh on September 28, 2026: reuse the Engineering Essentials and Design And Modeling graphics, individual VEX parts, classroom caliper, and independently authored game lever. The VEX lever assembly from the PLTW packet is explicitly excluded. The owner explicitly approved publishing this exact reviewed page and selected artwork in a public ClassroomActivities PR on September 28, 2026, after reviewing the desktop and mobile previews. This resolves the earlier automated public-disclosure approval gate. No curriculum archives are selected.

## Selected Sources

| Published Asset | Reviewed Source And Treatment |
| --- | --- |
| `src/art/ees-cog-workshop.svg`, `ees-cog-drafting-table.svg` | EngineeringEssentials26-27 at `ef996b67f272c5c37ebd1161809a2840a94666b3`, `templates/graphics/symbols/`; unchanged original course vector marks. The graphics README identifies them as original classroom adaptations. |
| `src/art/dm-cube-studio.svg` | DesignAndModeling26-27 at `279ddf7b047c58087632dbe3ce650f1cc156fc9f`, `templates/graphics/cube-family/marks/cube-studio.svg`; unchanged course mark. The graphic-family README traces its edges to the owner's written-response template. |
| `src/art/classroom-caliper.svg` | Same DM commit, `shared-resources/art/3d/classroom-dial-caliper/part-diagram.svg`; original schematic based on teacher-owned photos. Retains only instrument geometry, omitting labels, review annotations, axes, and the unverified depth rod. Decorative, not to scale; the model and articulation are still unfinished upstream. No photos or curriculum documents are copied. |
| `src/art/lever-apparatus.svg` | Same EES commit, `shared/art/3d/levers-load-effort-distance/models/apparatus.obj`; render of independently authored procedural geometry from LeversLoadEffortDistance commit `04ec60fe3218f44c96de77722ea63dd80cb7a129`. Preserves the exported level pose, with gold load, teal effort, lavender fulcrum, and blue-grey rail. Not VEX geometry or the packet assembly. |
| `src/art/vex-parts.svg` | LeverWorkshop commit `b237429e763dc17a6350f4dd0c2ea65728167464`, `public/assets/parts.json` and `parts.bin.gz`; only `upright`, `angle`, and `pin` meshes. Read its third-party notices and `docs/cad-provenance.json`: the meshes are VEX Robotics CAD, not original project geometry. Pastel materials and isolated arrangement are new. Manufacturer credit remains in the published notices; no blanket open-source claim is made over the geometry. |

The course repositories remain the canonical sources. Only these selected derivatives/marks enter this public repository. There is no copied PLTW artwork, complete VEX lever assembly, instructional wording, source packet, or answer key. The earlier C01 activity bank and its provenance hashes are unchanged.

## Reproduce The Decorative Exports

Use Python 3 with the standard library. Obtain the exact source files at the commits above into an external `asset-sources` folder. Name the original caliper file `caliper-original.svg`, and the cube `dm-cube-studio.svg`. Keep the other SVG and OBJ filenames as listed. Use a checkout of the pinned LeverWorkshop commit alongside it.

```sh
python3 scripts/render-classroom-art.py /path/to/asset-sources /path/to/LeverWorkshop src/art
```

The script copies the three identity marks, selects the caliper's existing vector geometry, and orthographically projects the original mesh triangles with back-face culling, depth ordering, and flat decorative lighting. Camera, placement, pastel materials, and SVG sizes are explicit in the script. These exports are illustration assets, not new calibrated models or hidden-line engineering drawings. The website needs no renderer dependency or external asset request.

## Input SHA-256

| Input | SHA-256 |
| --- | --- |
| `apparatus.obj` | `b4128e34fb81e1ea1c7077cfee702bc37273223db2f73422aaba04147fd394f6` |
| `caliper-original.svg` | `f8a6e28dd978c4eab5bd789f0812fb9aa2c120c8aa0b91fc17da3095da52757c` |
| `dm-cube-studio.svg` | `d4e9794fd305abd50f4cd18a0cc0e35f7bab5a296e1d218bd538c8f680f52349` |
| `ees-cog-drafting-table.svg` | `91705440d9dd8df56483fbddf57611f3a5015c206a2c6f5bd317ce4135fa592a` |
| `ees-cog-workshop.svg` | `90b200ab0cc24e8eef7b390243740566c0064dcc900a9da3432b29e62c71d73d` |
| `parts.bin.gz` | `1e97c8f2a87c6aa8259e49f2402ed1935473222fd52eb772391707ede9634ab7` |
| `parts.json` | `3d420ec14039dbec77e3729d5aff35a433ba06bf0e5216442d953fb21457c9da` |

## Interface Scope

The page uses the owner's exact replacement headline, introduction, eyebrow and privacy wording, with the source-code link on “Open source.” Decoration is marked as decorative for assistive technology, cannot intercept clicks, and does not enter response fields or the content bank. Both existing activity links, draft schemas, response IDs and storage keys remain stable. The privacy statement describes this application's local answer handling; choosing to attach downloaded work to Classroom remains a separate student action.

`scripts/public-inputs.mjs` explicitly includes these six SVGs and the published notices; the existing `src` fingerprint includes their bytes. Build identity continues to use the accepted development milestone `0.1.0 First Light`. This visual refresh does not close issue #3's managed-device and Classroom pilot.
