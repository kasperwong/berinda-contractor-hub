# BPM account access to Contractor Hub

Released in v0.51.0; seamless BPM handoff added in v0.52.0 and in-app embedding in v0.53.0, 18 October 2026.

## Sign-in behavior

- Select **BPM account** and use the existing BPM email and password. Firebase authenticates the credentials against the BPM project; the Hub exchange endpoint receives only the resulting ID token.
- The server verifies the token against the BPM project, checks revocation and disabled-account state, and reads the caller's BPM user profile. Only `approved` profiles without an explicit inactive/disabled flag are accepted.
- BPM access is always Viewer access. Contractor, project and document reads are allowed; creation, editing, uploads and deletion are denied by Firestore rules.
- Existing Hub accounts and their roles are never modified or merged by email. Admins and Editors retain their management access through **Hub password** or **Email link**. The same person can use BPM sign-in for a separate read-only session.
- A BPM identity gets a reserved, deterministic Hub UID derived from its BPM UID, without a Hub user-profile grant. This prevents matching an email from granting ownership of an existing Hub Admin account.
- Open **Contractor Hub** from BPM home (desktop/mobile) or Checklists. Hub opens inside a full-screen BPM panel and uses the parent BPM session without another login. **Back to BPM** closes the panel and restores the original page. The parent page stays available for automatic renewal.
- Documents open in BPM's existing read-only preview using a bounded Blob message from the registered Hub frame; no token or document URL is stored or exposed in links. The standalone Hub retains its existing document-opening behavior.
- Framing is limited by CSP to Hub itself, the two BPM hosting origins and the installed Android app's exact `https://localhost` origin. Parent and opener compatibility both require the exact trusted origin, source window and request ID. The Android update permits only HTTPS Hub subframe navigation on the default port; other native navigation keeps its existing policy.
- The handoff uses a random request ID and exact-origin/source-window checks in both directions. The URL and session storage contain only the request ID, never a token. Firebase ID tokens travel in memory through `postMessage` with an explicit target origin, then the Hub server repeats its approval check.
- A direct Hub visit still offers BPM password sign-in and existing Hub sign-in methods. Signing out of BPM also signs out linked Hub tabs; signing out of Hub does not sign out the BPM app.

## Approval lifetime and sign-out

Each successful exchange grants 15 minutes of read access, enforced by the signed `bpmApprovedUntil` claim in Firestore rules. The client renews every 10 minutes and rechecks on returning to an old tab. Removed, rejected, disabled and revoked accounts fail renewal. Existing approval can therefore last at most 15 minutes after removal; refreshing an expired Hub token cannot extend it.

Sign-out clears both the Hub session and the Hub origin's secondary BPM-auth session. A pending renewal cannot sign the user back in after sign-out.

## Deployment configuration

The existing App Hosting compute service account requires:

- `roles/firebaseauth.viewer` in `berinda-project-management` to verify account revocation/disabled state.
- `roles/iam.serviceAccountTokenCreator` on its own service-account resource to sign Hub custom tokens, with the IAM Credentials API enabled in the Hub project. No service-account key is downloaded or embedded.

The exchange endpoint accepts same-site POST requests only, sends `Cache-Control: private, no-store`, and never logs tokens or passwords. Firestore rules enforce the Viewer boundary independently of UI controls.

## Validation and rollback

- `npm test`: production build, existing integration checks and BPM approval-policy tests.
- `npm run test:bpm:rules`: requires Java and the Firebase CLI; runs against the local `demo-hub-bpm` emulator only. Covers directory/project/document/chunk reads, blocked writes, expired approval, reserved-UID fallback prevention, and existing Hub Admin/Editor permissions.
- Before deployment, live rules were compared with the Git baseline and backed up under `tmp/bpm-auth-deploy/`. IAM policies were also backed up there before adding the necessary bindings.
- Deploy rules before the app. For rollback, restore the preceding app commit and the backed-up rules, then remove only IAM bindings added by this release if no longer needed. No contractor records or existing Hub profiles require migration or restoration.
