# AI-DLC Workshop — Presentation v5

**Format:** 3 hours · 54 editable slides · Open Sans · Emerald/cream theme · Visual Storyflow v6

## Agenda (180 minutes)
| Segment | Minutes |
|---|---:|
| AI-DLC Concepts & Methodology | 60 |
| Practical Case Study: Human-led SDLC vs AI-DLC | 25 |
| Lab Readiness (setup in advance) | 5 |
| Hands-on Team Challenge | 70 |
| Team Showcase | 15 |
| Q&A / Wrap-up | 5 |

## Slides 01–20 — AI-DLC Foundation
1. AI-DLC workshop introduction
2. Learning path and agenda
3. Three modes of AI Coding: Autocomplete, Chat-assisted, Agent
4. AI-assisted Coding vs AI-DLC
5. AI-DLC maturity model (illustrative)
6. AI-DLC on Kiro, Claude Code and Codex CLI
7. Inception → Construction → Operation; Units, Bolts, Roles and Artifacts
8. Initialization and Ideation
9. Inception and Requirements
10. Construction and Bolts
11. Operation and Feedback
12. Five phases and stages
13. Clickable Stage-by-Scope Matrix
14. Depth / Test Strategy
15. Interaction modes
16. Agent and Human Roles
17. Human Validation Gates
18. Artifacts, State and Audit Trail
19. Bolt / Mob / Gate
20. AI-DLC Security: Code → Cloud → Runtime

## Slides 21–30 — Scenario comparison as a visual story (v6)
**Illustrative case:** The IT Service Desk receives incidents through Chat and Email. The team builds one incident tracking MVP. No benchmarks or identifiable real customer are claimed.

Slides are icon-led process scenes with actor → action → artifact and a seven-chapter progress strip, rather than side-by-side text tables:

21. **Business problem** — Employee messages from Chat/Email → central incident board
22. **Human-led SDLC** — PO/BA → Architect → Developer → QA/Ops; handoffs through Ticket Board / Design Docs / Git PR / CI
23. **AI-DLC workflow** — PO sets intent → AI drafts spec → AI builds slices → tests; PO/SA/Developer/QA remain accountable; Team Workspace → Artifacts → Code Repo → Test Logs
24. **Requirements** — business request branches into human-led interview vs AI-assisted clarification; PO signs off on common User Story and Acceptance Criteria
25. **Architecture** — shared UI → API → Data design; SA owns architecture, AI can propose alternatives
26. **Implementation** — tickets and PR vs Unit and Bolt; developer inspects real diffs
27. **Testing** — Acceptance Criteria → executed test evidence; never mistake NOT RUN for PASS
28. **Change** — P1 incident resolution requires Owner + Resolution Note; trace impact across UI/API/Data/Regression
29. **Release & Operation** — PR → CI + Security → Approval → Operations; workshop is *local prototype only*
30. **Takeaway** — identical quality bar; compare execution and accountability visually

The story is also explained in the slide speaker notes. The example Change Request is *not* a hidden challenge in the hands-on lab. Text-heavy slides elsewhere in the core deck and lab section were also redesigned as editable PowerPoint icon workflows.


## Slides 31–33 — BA → Developer Handover (New v7)
31. **One Intent, Two People, One Git History** — BA/PO finishes requirements and parks; reviewed PR transmits AI-DLC records; SA/Developer pulls, selects intent and resumes
32. **Folder architecture** — shared application code, tests, AI-DLC state/artifacts/audit, team decisions & handover docs; secrets and active-intent cursor stay local
33. **Handover procedure** — Park → Git commit/push → PR review/merge → Pull → Select Intent → Resume (Codex uses $aidlc)

Full practical instructions: [collaboration/](../collaboration/README.md). This is a collaboration teaching extension, not an additional mandatory 70-minute challenge.

## Slides 34–43 — Team Challenge, Showcase and Wrap-up
34. Hands-on Lab section cover
35. IT Incident Management mission
36. Roles: PO, SA, Developer, QA/DevOps
37. GitHub Workshop Guide
38. Hands-on six steps / 70 minutes
39. Steps 01–03
40. Steps 04–06
41. Validation and Test Evidence
42. Team Showcase
43. Summary

## Slides 44–54 — Interactive Scope Matrix Appendix
Clickable detail slides for enterprise (44), feature (45), mvp (46), poc (47), bugfix (48), refactor (49), infra (50), security-patch (51), classic (52), workshop (53), express (54).

Open in **PowerPoint Slide Show** mode and click a scope card on slide 13; Back to Matrix returns to slide 13. The matrix is based on stock-scope Stage membership; conditional stages may be skipped at runtime. MVP has 23 / 33 stages included in its stock plan.

## Sources and interpretation
- [AWS Labs AI-DLC Workflows — Phases & Stages](https://awslabs.github.io/aidlc-workflows/guide/04-phases-and-stages/)
- [AWS Labs AI-DLC Workflows — Scopes & Matrix](https://awslabs.github.io/aidlc-workflows/guide/05-scopes-and-depth/)
- [Wiz Academy — AI-DLC, AppSec and Code-to-Cloud risk](https://www.wiz.io/academy/ai-security/ai-driven-development-lifecycle-ai-dlc)

The case illustrates a practical workflow comparison and does **not** claim measured time/cost savings or describe a particular customer engagement. Humans remain accountable for decisions and approvals in both approaches.
