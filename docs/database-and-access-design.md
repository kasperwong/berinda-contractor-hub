# Berinda Contractor Hub — Database and Access Design

Status: Phase 1 and Phase 2 foundation  
Storage: Cloud Firestore for structured records; SharePoint for original documents  
Default security position: deny access unless a rule explicitly allows it

## 1. Core structure

```text
groups/{groupId}
companies/{companyId}
users/{userId}
contractors/{contractorId}
  projects/{projectId}
  prequalifications/{assessmentId}
  financials/{snapshotId}
  documents/{documentId}
nominations/{nominationId}
  selections/{selectionId}
extractionJobs/{jobId}
accessRequests/{requestId}
prequalificationCriteria/{criteriaVersion}
auditLogs/{logId}
```

Every business record carries a `groupId`. Company-owned records also carry an
`owningCompanyId` or `companyId`. Security rules compare these values with the
signed-in user's server-controlled profile before returning any record.

## 2. Information sharing

- `group`: approved contractor profile and project records can be read by active
  users in the same group.
- `restricted`: only group reviewers/administrators and users from the owning
  company can read the contractor.
- Financial snapshots and complete Pre-Q assessments are always restricted to
  authorised reviewers, administrators, auditors and the owning company.
- Original files stay in SharePoint. Firestore holds document metadata and the
  SharePoint web link only. SharePoint performs its own permission check when a
  user opens or downloads the file.

## 3. Roles

| Role | Main authority |
| --- | --- |
| Group administrator | Manage companies, users and all group records |
| Company administrator | Manage own company users and contractor submissions |
| Reviewer | Review Pre-Q and financial information; approve nominations |
| Project user | Search shared records and prepare nominations |
| Viewer | Read approved shared contractor information |
| Auditor | Read financial and audit records without editing |

## 4. Sensitive information controls

- Full financial data is separated from the contractor directory.
- Client-side users cannot create audit logs. Trusted server functions create
  them so a user cannot erase or falsify their activity history.
- Extraction jobs can be submitted by approved users, but only trusted server
  functions may change processing results.
- Contractor and assessment records cannot be hard-deleted from the browser.
  They are archived to keep the approval history.
- The Firebase web configuration is not an administrator credential. Firebase
  Admin service-account credentials must never be stored in browser code,
  source control or `.env.example`.

## 5. Identity approach

The production target is Microsoft Entra ID company login. Each authenticated
identity is matched to a `users/{uid}` record containing group, company, role and
active status. Authentication identifies the person; Firestore rules separately
decide what that person may access.

The current private prototype remains protected by the hosting platform while
the Microsoft/Firebase identity integration is prepared.

## 6. Document extraction lifecycle

```text
SharePoint document uploaded
  → extraction job queued
  → approved AI service processes all pages
  → proposed project rows stored in a review queue
  → low-confidence fields flagged
  → reviewer accepts or corrects exceptions
  → verified projects published
```

The source filename, page number, original scope text and extraction confidence
are retained so every imported value can be checked against its source.

## 7. Environments

Use two Firebase projects:

1. Development — sample and test contractor data only.
2. Production — approved business records with backups, monitoring and strict
   access administration.

Never copy live contractor financial documents into the development project.

## 8. Decisions needed before live connection

- Confirm the official Berinda subsidiary list and the first pilot companies.
- Nominate the initial group administrators and Pre-Q reviewers.
- Confirm whether all approved contractor projects are group-visible or whether
  some companies require restricted project records.
- Confirm the Microsoft 365 administrator who can register the company login
  application and approve SharePoint permissions.
