import { createHash } from "node:crypto";

export const BPM_ACCESS_WINDOW_MS = 15 * 60 * 1000;

export class BpmAccessError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

type BpmIdentity = { uid: string; email?: string; name?: string };
type BpmProfile = { status?: string; active?: boolean; disabled?: boolean; name?: string };
type Dependencies = {
  verifyToken: (token: string) => Promise<BpmIdentity>;
  readProfile: (token: string, email: string) => Promise<BpmProfile | null>;
  mintToken: (uid: string, claims: Record<string, unknown>) => Promise<string>;
  now?: () => number;
};

export async function createBpmViewerSession(token: string, dependencies: Dependencies) {
  if (!token || token.length > 16384) throw new BpmAccessError("BPM sign-in required.", 401);
  let identity: BpmIdentity;
  try {
    identity = await dependencies.verifyToken(token);
  } catch {
    throw new BpmAccessError("Your BPM session has expired. Sign in again.", 401);
  }
  const email = identity.email?.trim().toLowerCase() ?? "";
  if (!identity.uid || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BpmAccessError("A BPM account with a company email is required.");
  }
  const profile = await dependencies.readProfile(token, email);
  if (profile?.status?.toLowerCase() !== "approved" || profile.active === false || profile.disabled === true) {
    throw new BpmAccessError("Only approved, active BPM accounts can access Contractor Hub.");
  }
  // Separate identities prevent BPM login from assuming ownership of a Hub
  // Admin/Editor account with the same email. Existing Hub accounts are untouched.
  const uid = `bpm_${createHash("sha256").update(identity.uid).digest("hex")}`;
  const approvedUntil = (dependencies.now?.() ?? Date.now()) + BPM_ACCESS_WINDOW_MS;
  const customToken = await dependencies.mintToken(uid, {
    bpmViewer: true,
    bpmUid: identity.uid,
    bpmEmail: email,
    bpmDisplayName: (profile.name || identity.name || email).slice(0, 80),
    bpmApprovedUntil: approvedUntil,
  });
  return { customToken, approvedUntil, role: "viewer" as const };
}
