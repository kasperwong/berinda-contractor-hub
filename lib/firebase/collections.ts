export const COLLECTIONS = {
  groups: "groups",
  companies: "companies",
  users: "users",
  contractors: "contractors",
  nominations: "nominations",
  extractionJobs: "extractionJobs",
  accessRequests: "accessRequests",
  auditLogs: "auditLogs",
  prequalificationCriteria: "prequalificationCriteria",
} as const;

export const CONTRACTOR_SUBCOLLECTIONS = {
  projects: "projects",
  prequalifications: "prequalifications",
  financials: "financials",
  documents: "documents",
} as const;

export const NOMINATION_SUBCOLLECTIONS = {
  selections: "selections",
} as const;
