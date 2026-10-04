# Contractor documents update

- [x] Push the document library release to the Firebase-linked GitHub repository.
- [x] Deploy Firestore document storage rules and create a Firebase App Hosting rollout.
- [x] Verify the document controls on the Firebase production URL.

- [x] Confirm the deployed bundle contains the new document library.
- [x] Identify stale browser caching caused by a reused asset address.
- [x] Publish a cache-busted release and verify the live asset address changed.

- [x] Create a local pre-change backup and archive.
- [x] Replace SharePoint sample references with persistent uploaded documents.
- [x] Restrict upload, rename, and delete to Admin and Editor roles.
- [x] Allow active Viewers to view and download documents.
- [x] Update Firebase Firestore rules and authenticated object-storage access.
- [x] Run production builds, lint, and rules verification.
- [x] Deploy security rules and prepare the validated site release.
# Contractor Hub v0.48.0 - WorkPro Checklist selection bridge - 2026-10-03

- [x] Preserve the existing portal and create a pre-change recovery folder and ZIP.
- [x] Accept a selection request only for the WorkPro Checklist integration and allowlisted return origin.
- [x] Let an authenticated Hub user open a contractor profile and return a bounded contractor snapshot.
- [x] Support direct contractor profile links using the contractor record ID.
- [x] Run build, focused integration tests, and phone QA.
- [ ] Deploy only if explicitly requested.

---
# Contractor Hub v0.49.0 - BPM-authenticated directory endpoint - 2026-10-03

- [x] Preserve the current portal and create a v0.48.0 recovery folder and ZIP.
- [x] Add a read-only endpoint that validates BPM Firebase identity and approved BPM status.
- [x] Return only the contractor fields required by Checklist Tenderers.
- [x] Keep normal Contractor Hub pages behind the existing AuthGate.
- [x] Add endpoint security tests and run build/lint verification.
- [ ] Deploy only if explicitly requested.

---
