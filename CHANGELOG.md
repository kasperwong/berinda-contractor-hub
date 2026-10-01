# Changelog

## Unreleased

### Added

- Multi-contractor selection and side-by-side Contractor Experience Evaluation.
- Automatic 10-criterion experience assessment using project recency, scope similarity, proposed contract value, and Group-company history.
- Downloadable Contractor Experience Evaluation report with evaluation inputs and supporting project detail.

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
