export type IsoDate = string;
export type IsoDateTime = string;

export type UserRole =
  | "group_admin"
  | "company_admin"
  | "reviewer"
  | "project_user"
  | "viewer"
  | "auditor";

export type ShareScope = "group" | "restricted";
export type RecordLifecycle = "active" | "archived";
export type PrequalificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "conditional"
  | "rejected"
  | "expired";

export interface AuditFields {
  createdAt: IsoDateTime;
  createdBy: string;
  updatedAt: IsoDateTime;
  updatedBy: string;
  revision: number;
}

export interface Company extends AuditFields {
  id: string;
  groupId: string;
  legalName: string;
  shortName: string;
  registrationNumber: string | null;
  active: boolean;
}

export interface UserProfile extends AuditFields {
  id: string;
  groupId: string;
  companyId: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  identityProvider: "microsoft_entra" | "chatgpt_workspace";
  lastSignedInAt: IsoDateTime | null;
}

export interface Contractor extends AuditFields {
  id: string;
  groupId: string;
  owningCompanyId: string;
  legalName: string;
  tradingName: string | null;
  registrationNumber: string | null;
  taxNumber: string | null;
  incorporationDate: IsoDate | null;
  headquartersState: string | null;
  headquartersCountry: string;
  phone: string | null;
  generalEmail: string | null;
  website: string | null;
  tradeCategories: string[];
  cidbGrade: string | null;
  cidbRegistrationNumber: string | null;
  cidbExpiryDate: IsoDate | null;
  prequalificationStatus: PrequalificationStatus;
  latestPrequalificationScore: number | null;
  prequalificationValidUntil: IsoDate | null;
  shareScope: ShareScope;
  lifecycleStatus: RecordLifecycle;
  duplicateCheckKey: string;
}

export interface ContractorProject extends AuditFields {
  id: string;
  contractorId: string;
  projectName: string;
  projectScopeRaw: string;
  projectScopeSummary: string;
  projectCategories: string[];
  contractingClient: string | null;
  developerEndClient: string | null;
  locationRaw: string | null;
  city: string | null;
  state: string | null;
  country: string;
  contractValueMyr: number | null;
  valueIsApproximate: boolean;
  commencementDate: IsoDate | null;
  completionDate: IsoDate | null;
  contractPeriodRaw: string | null;
  projectStatus: "completed" | "ongoing" | "unknown";
  completionPercentage: number | null;
  sourceDocumentId: string;
  sourcePage: number | null;
  extractionConfidence: number | null;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy: string | null;
  verifiedAt: IsoDateTime | null;
}

export interface PrequalificationAssessment extends AuditFields {
  id: string;
  contractorId: string;
  criteriaVersion: string;
  proposedContractValueMyr: number;
  requiredPassingScore: number;
  organisationScore: number;
  technicalScore: number;
  financialScore: number;
  workExperienceScore: number;
  qualityOrWorkloadScore: number;
  totalScore: number;
  status: PrequalificationStatus;
  reviewerComments: string | null;
  submittedAt: IsoDateTime | null;
  reviewedAt: IsoDateTime | null;
  approvedAt: IsoDateTime | null;
  validUntil: IsoDate | null;
}

export interface ContractorFinancialSnapshot extends AuditFields {
  id: string;
  contractorId: string;
  financialYears: number[];
  averageRevenueMyr: number | null;
  averageNetProfitMyr: number | null;
  averageEquityMyr: number | null;
  averageLiabilitiesMyr: number | null;
  reviewedBy: string | null;
  reviewedAt: IsoDateTime | null;
  reviewOutcome: "pending" | "satisfactory" | "attention_required";
}

export interface DocumentReference extends AuditFields {
  id: string;
  contractorId: string;
  category:
    | "preq_form"
    | "project_list"
    | "cidb"
    | "financial"
    | "quality"
    | "insurance"
    | "other";
  fileName: string;
  sharePointWebUrl: string;
  sharePointDriveItemId: string | null;
  mimeType: string;
  documentDate: IsoDate | null;
  expiryDate: IsoDate | null;
  accessClassification: "group" | "restricted";
  virusScanStatus: "pending" | "clean" | "blocked";
}

export interface Nomination extends AuditFields {
  id: string;
  groupId: string;
  companyId: string;
  projectTitle: string;
  tradeCategory: string;
  proposedContractValueMyr: number | null;
  status: "draft" | "submitted" | "approved" | "rejected" | "exported";
  reviewerId: string | null;
  reviewerComments: string | null;
  submittedAt: IsoDateTime | null;
  approvedAt: IsoDateTime | null;
  exportedAt: IsoDateTime | null;
}

export interface NominationSelection extends AuditFields {
  id: string;
  nominationId: string;
  contractorId: string;
  selectedProjectIds: string[];
  contractorSnapshot: Pick<
    Contractor,
    "legalName" | "cidbGrade" | "latestPrequalificationScore" | "prequalificationStatus"
  >;
  selectionReason: string | null;
  displayOrder: number;
}

export interface ExtractionJob extends AuditFields {
  id: string;
  groupId: string;
  companyId: string;
  contractorId: string;
  documentId: string;
  status: "queued" | "processing" | "review_required" | "completed" | "failed";
  pageCount: number | null;
  pagesProcessed: number;
  rowsFound: number;
  rowsAccepted: number;
  rowsFlagged: number;
  errorCode: string | null;
}

export interface AuditLog {
  id: string;
  groupId: string;
  companyId: string | null;
  actorUserId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  occurredAt: IsoDateTime;
  requestId: string;
  changedFields: string[];
}
