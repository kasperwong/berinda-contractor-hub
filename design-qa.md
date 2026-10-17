# Design QA — Search-first mobile contractor view

## Live verification — 2026-10-17

- Firebase confirmed the v0.50 rollout succeeded and serves 100% of traffic; deployed public assets contain the navigation, Back and contact improvements.
- In the signed-in phone session, FBG Builder loaded 17 portfolio projects and 2 documents. Projects showed “17 of 17 projects shown.”
- Back returned from Documents to Overview, then to the same Main Contractor filter and 11 results. Bottom Projects and Documents retained FBG Builder as the selected contractor.
- Viewing the existing project-list PDF completed its authenticated retrieval and opened a PDF tab. Automated PDF-content inspection is blocked by the browser's blob-URL security policy; user confirmation was requested.
- An unauthenticated document-metadata request returned HTTP 403 PERMISSION_DENIED.
- Live data exposed long-name spacing and visible editor controls on phone document views. v0.50.1 addresses both; its production build and six integration tests pass, with zero lint errors and five existing warnings.
- Deployment and browser evidence are saved in `tmp/hp-live-verification/` and `tmp/hp-deployment-status.json`.

## HP navigation and contact update — 2026-10-16

- Checked local development preview at 393 × 852 and 320 × 740, plus desktop at 1440 × 900.
- AJC's portfolio summary, project tab, recent experience and project-list denominator now include the same Group reference project: 1 project, RM8.7M, “1 of 1 projects shown.”
- Phone startup opens Search. Top navigation provides Back, and profiles also provide Search. Returning preserves query/filter state and the result position; a lower result returned at scrollY 349.6 during the narrow-screen check.
- Profiles show Call, Email and Maps links, with destination URLs checked without initiating calls, emails or map requests.
- Overview, Projects and Documents are visible together; More expands assessment and activity. Opening a profile focuses Back, locks background scrolling, and restores trigger focus on close.
- Bottom Projects/Documents prompt for a contractor before a selection is made.
- Empty search recovery, directory refresh failure/retry and document failure/retry were exercised. Live Firebase permissions and actual document viewing were not verified in this unauthenticated local preview.
- The contractor form at 320px has clientWidth 266 and scrollWidth 266 after constraining the hidden Excel input and form grid. Desktop form opened and was cancelled without submitting. Mobile overview hides creation/export entry cards.
- Production build passed; six existing integration tests passed; lint has zero errors and five existing warnings. Browser console errors: none observed.
- Screenshots saved under `tmp/hp-improvements-20261016/`; `02-profile.png` shows the completed phone profile and `07-form-320.png` shows the narrow form.
- Changes are local; no production deployment or record changes were performed.

## Result

Passed on 2026-09-15.

- P1 blockers: 0
- P2 material mismatches: 0
- P3 polish notes: 0

## Evidence

- Approved visual direction: `C:\Users\User\.codex\generated_images\01a0a45a-8830-7af0-b098-6c584f5af378\exec-7b64f623-c36d-4c41-8d35-3f306674cda7.png`
- Side-by-side comparison: `tmp/qa-mobile-comparison.png`
- Search landing: `tmp/qa-mobile-search.png`
- Search result: `tmp/qa-mobile-results.png`
- Project view: `tmp/qa-mobile-projects.png`
- Document view: `tmp/qa-mobile-documents.png`

## Visual review

- Search-first hierarchy, navy-and-gold brand treatment, rounded cards, count badges, status chips, and fixed bottom navigation match the approved direction.
- Contractor names, trade labels, counts, status, location, score, grade, and validation date are sourced from current application records rather than mock content.
- Fewer trade cards than the visual direction is intentional: categories with zero contractor records are omitted.
- Project rows collapse into readable mobile cards; document access is clearly read-only on mobile.
- No clipped controls, overlapping content, or hidden mobile navigation were found at 393 × 852.

## Functional review

- Direct contractor-name search returned the expected single record for `AJC`.
- Selecting a trade returned only contractors in that trade.
- Opening a contractor profile and switching to Projects and Documents worked.
- Mobile editing, upload, import, decision, and download controls are hidden; View remains available for documents.
- Browser console errors: none.
- Desktop regression check passed at 1440 × 900.
- `npm run lint` passed with only pre-existing warnings.
- `npm run build` passed.
