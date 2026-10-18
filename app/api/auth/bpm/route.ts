import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import { BpmAccessError, createBpmViewerSession } from "@/lib/auth/bpm-policy";

const HUB_ORIGIN = "https://contractor-hub--berinda-contractor-hub.asia-southeast1.hosted.app";
const BPM_PROJECT = "berinda-project-management";
const HUB_PROJECT = "berinda-contractor-hub";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "private, no-store, max-age=0", "Pragma": "no-cache" };
  const origin = request.headers.get("origin");
  const localOrigin = process.env.NODE_ENV !== "production" &&
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin ?? "");
  if (origin !== HUB_ORIGIN && !localOrigin) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403, headers });
  }
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  try {
    const bpmApp = getApps().find(app => app.name === "bpm-sign-in-verifier") ??
      initializeApp({ projectId: BPM_PROJECT }, "bpm-sign-in-verifier");
    const hubApp = getApps().find(app => app.name === "bpm-hub-token-signer") ??
      initializeApp({ projectId: HUB_PROJECT,
        serviceAccountId: "firebase-app-hosting-compute@berinda-contractor-hub.iam.gserviceaccount.com",
      }, "bpm-hub-token-signer");
    const session = await createBpmViewerSession(token, {
      verifyToken: (idToken) => getAuth(bpmApp).verifyIdToken(idToken, true),
      readProfile: async (idToken, email) => {
        const response = await fetch(
          `https://firestore.googleapis.com/v1/projects/${BPM_PROJECT}/databases/(default)/documents/users/${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${idToken}` }, cache: "no-store", signal: AbortSignal.timeout(10000) },
        );
        if (!response.ok) return null;
        const { fields = {} } = await response.json();
        return { status: fields.status?.stringValue, active: fields.active?.booleanValue,
          disabled: fields.disabled?.booleanValue, name: fields.name?.stringValue };
      },
      mintToken: (uid, claims) => getAuth(hubApp).createCustomToken(uid, claims),
    });
    return NextResponse.json(session, { headers });
  } catch (error) {
    if (error instanceof BpmAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers });
    }
    // Do not log credentials, tokens, or request headers.
    console.error("BPM sign-in service unavailable", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "BPM sign-in is temporarily unavailable. Please try again." }, { status: 503, headers });
  }
}
