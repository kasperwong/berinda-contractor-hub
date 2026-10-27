# Changelog

## [0.53.0] - 2026-10-18

- Support the trusted BPM parent frame so Hub and automatic approved-Viewer sign-in stay inside BPM, including the installed Android app origin.
- View documents through BPM's existing preview instead of opening an external tab. Restrict embedding to the BPM hosts, installed app origin and Hub itself.

## [0.52.0] - 2026-10-18

- Open Hub from BPM without a second login through an exact-origin, window-bound session handoff. Fresh BPM tokens renew the Viewer session while the originating BPM page remains open; BPM sign-out ends linked Hub access.
- Preserve server-side approved-account verification, short approval lifetime, Viewer restrictions and existing Hub roles. Tokens are never placed in links or browser storage.

## [0.51.0] - 2026-10-18

- Added BPM account sign-in for approved, active BPM users with read-only Contractor Hub access.
- Kept BPM viewer identities separate from existing Hub accounts; Admin and Editor roles and their Hub sign-in remain unchanged.
- Added server-side verification of token revocation, disabled accounts and BPM approval, with renewal every 10 minutes and a 15-minute rules-enforced approval limit.
- Added read-only Firestore protection for BPM sessions, hid management controls for Viewers, and stopped automatic writes from viewer sessions.
- Added approval-policy tests and Firestore emulator tests covering viewer access, blocked writes, expired approvals and preserved Hub Admin/Editor permissions.

## [0.50.1] - 2026-10-17

- Improved space for live contractor names on short phone screens; project and document views prioritize their content over the summary grid.
- Hid document upload, rename, delete and download controls in the read-only phone view while preserving View and desktop editor controls.

## [0.50.0] - 2026-10-16

- Added phone navigation with Back and Search, preserved search state, and quick contractor contact actions.
- Corrected portfolio totals, fixed narrow-screen form overflow, and improved profile tabs and document loading/retry feedback.
- Verified the local production build, six integration tests, and phone/desktop layouts before the Firebase App Hosting rollout.

## [0.49.0] - 2026-10-03

### Added

- Added a read-only contractor directory endpoint for the WorkPro Checklist picker.
- Added BPM Firebase token verification and approved BPM profile validation before any directory record is returned.

### Security

- Returns only contractor ID, name, trade, CIDB grade, location, Pre-Q score/date, and status.
- Keeps normal Contractor Hub pages and all private contractor details behind the existing Contractor Hub authentication gate.

## [0.48.0] - 2026-10-03

### Added

- Added an authenticated WorkPro selection mode that returns a bounded contractor identity, CIDB, location, Pre-Q, score, and status snapshot to the opening Checklist Tenderer card.
- Added direct `?contractor=` profile links so a linked Tenderer can reopen its authoritative Contractor Hub profile.

### Security

- Restricted selection responses to the exact WorkPro production origin, with localhost accepted only during local development.

## Unreleased

### Phone experience — 2026-10-16

- Added a sticky phone navigation bar with Back and Search actions; returning from a profile preserves search filters and the result position.
- Made portfolio counts, combined value, recent experience and project-list totals use the same project source, including Group reference projects.
- Added Call, Email and Maps actions for available contractor contact details.
- Kept Overview, Projects and Documents visible together on phones, with assessment and activity under More.
- Added contractor-selection prompts for bottom navigation, clear-filter recovery, refresh status and retry controls.
- Added phone profile focus handling and background scroll locking.
- Fixed narrow form grids and the hidden Excel input that caused horizontal overflow; removed creation/export entry cards from the phone overview.
- Distinguished document-loading failures from an empty document library.

### Added

- Multi-contractor selection and side-by-side Contractor Experience Evaluation.
- Automatic 10-criterion experience assessment using project recency, scope similarity, proposed contract value, and Group-company history.
- Downloadable Contractor Experience Evaluation report with evaluation inputs and supporting project detail.
- Visible Project evaluation navigation entry on desktop, tablet, and mobile layouts.
- Readable multi-contractor evaluation table with preserved column widths, sticky criteria columns, and contained horizontal scrolling.
- Similar-project evaluation by project scope, building type, or both, with the selected basis recorded in the exported report.
- Approved building-type selection in project forms, plus free-text building keywords for Contractor Experience Evaluation.
- Select-filtered action that selects only contractors matching the current evaluation search.
- Clickable evaluation results with a project breakdown showing every project counted for the selected contractor and criterion.
- Owner-controlled recent-experience period using one “past years to consider” input, calculated automatically from the current year.
- Shareable Project Evaluation links that restore selected contractors, calculation inputs, matching keywords, and manually selected report projects for signed-in users.
- Evaluation report project details limited to qualifying projects, grouped by contractor company in separate sections for each applicable requirement.
- Separate A4 landscape printing for every counted-project popup, using the sample's fixed seven-column proportions with Project Name occupying half the table width.
- Five additional evaluation criteria for ongoing counts and value, recent completed counts and value, and the highest-value similar project.

## [0.47.0] - 2026-09-11

### Fixed

- Published the document library through the Firebase App Hosting production pipeline.
- Stored uploaded document data in Firestore so upload, view, download, rename, and delete work on the Firebase-hosted app.

## [0.46.0] - 2026-09-11

### Fixed

- Versioned production assets so browsers cannot retain the removed SharePoint document mockup after deployment.

## [0.45.0] - 2026-09-11

### Added

- Persistent contractor document uploads stored securely in site object storage.
- Document viewing and downloading for all active users.
- Document rename and delete controls for Admin and Editor roles.

### Removed

- The five sample SharePoint document references and SharePoint-specific messaging.
