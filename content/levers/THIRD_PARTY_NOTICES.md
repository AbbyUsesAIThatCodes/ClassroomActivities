# Lever Content Notices

## Authorship And Publication Scope

The selected questions, instructional labels, and diagrams were independently developed for AbbyUsesAIThatCodes with AI assistance. Publication is authorized for this project. This task assigns no repository-wide open-source or Creative Commons license and makes no claim of exclusive ownership over general facts, formulas, or standard terminology.

The activity is not an official PLTW product. No PLTW affiliation or endorsement is implied. PLTW curriculum files and publisher artwork are not part of this selection.

## Diagram Lineage

The fourteen PNGs depict procedural teaching geometry from [LeversLoadEffortDistance at commit 04ec60fe3218f44c96de77722ea63dd80cb7a129](https://github.com/AbbyUsesAIThatCodes/LeversLoadEffortDistance/tree/04ec60fe3218f44c96de77722ea63dd80cb7a129). The inspected `src/apparatus.js` constructs the beam, support, crate, and hanging mass from mathematical primitives.

The beam/support lineage includes [ThreeKindsOfLevers at commit b017384dbcd433ab34e8c432e2a5d4a94846e6e2](https://github.com/AbbyUsesAIThatCodes/ThreeKindsOfLevers/blob/b017384dbcd433ab34e8c432e2a5d4a94846e6e2/src/scene.js). The upstream game's [provenance record](https://github.com/AbbyUsesAIThatCodes/LeversLoadEffortDistance/blob/04ec60fe3218f44c96de77722ea63dd80cb7a129/docs/PROVENANCE.md) also credits MechanicalAdvantage and LeverWorkshop for other components. This review selects only the inspected procedural apparatus drawings; it does not clear all assets in those repositories.

The PNGs are independently rendered orthographic hidden-line drawings with project-authored labels. They contain neither VEX CAD geometry nor copied publisher illustrations. Do not infer publication permission for other upstream files from their presence here.

## Libraries And Fonts

| Dependency | Role In The Artwork | Distribution In This Selection |
| --- | --- | --- |
| three.js 0.180.0 | Mathematical geometry creation upstream; MIT licensed, copyright 2010–2025 three.js authors. | No three.js source or runtime bundle. Its upstream [full license](https://github.com/AbbyUsesAIThatCodes/LeversLoadEffortDistance/blob/04ec60fe3218f44c96de77722ea63dd80cb7a129/public/licenses/three-LICENSE.txt) remains available. Include that notice if later work distributes the library. |
| DejaVu Sans | Rasterized instructional labels. DejaVu changes are public domain; original Bitstream Vera copyright 2003 Bitstream, Inc., with the Bitstream Vera font license. | Only rendered glyph pixels; no font software or embedded font subset. If fonts are later bundled, include their complete applicable license and notices. |
| NumPy, ReportLab, PyMuPDF | Earlier local geometry processing, page drawing, and rasterization tools. | No tool source, executable, library bundle, or PDF. This selection consists of static PNG output and student text. Rebuilding or distributing tools requires a separate dependency review. |

No Comic Neue or Comic Sans font files, browser application, remote font requests, CDN scripts, or other runtime dependencies are included. The independent student application must review its own dependencies when implemented.
