import type { UserRole } from "./types";

export type Capability =
  | "manage_group"
  | "manage_company_users"
  | "read_shared_contractors"
  | "manage_owned_contractors"
  | "review_prequalification"
  | "read_financials"
  | "create_nomination"
  | "approve_nomination"
  | "read_audit_logs";

const capabilitiesByRole: Record<UserRole, ReadonlySet<Capability>> = {
  group_admin: new Set([
    "manage_group",
    "manage_company_users",
    "read_shared_contractors",
    "manage_owned_contractors",
    "review_prequalification",
    "read_financials",
    "create_nomination",
    "approve_nomination",
    "read_audit_logs",
  ]),
  company_admin: new Set([
    "manage_company_users",
    "read_shared_contractors",
    "manage_owned_contractors",
    "read_financials",
    "create_nomination",
  ]),
  reviewer: new Set([
    "read_shared_contractors",
    "review_prequalification",
    "read_financials",
    "create_nomination",
    "approve_nomination",
  ]),
  project_user: new Set(["read_shared_contractors", "create_nomination"]),
  viewer: new Set(["read_shared_contractors"]),
  auditor: new Set(["read_shared_contractors", "read_financials", "read_audit_logs"]),
};

export function roleCan(role: UserRole, capability: Capability): boolean {
  return capabilitiesByRole[role].has(capability);
}
