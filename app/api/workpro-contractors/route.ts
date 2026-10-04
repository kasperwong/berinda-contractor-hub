import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const WORKPRO_PROJECT_ID = "berinda-project-management";
const HUB_PROJECT_ID = "berinda-contractor-hub";
const PRODUCTION_ORIGIN = "https://berinda-project-management.web.app";
const NATIVE_ORIGINS = new Set(["http://localhost", "https://localhost", "capacitor://localhost"]);
const DEVELOPMENT_ORIGINS = new Set(["http://127.0.0.1:8765", "http://localhost:8765"]);

function allowedOrigin(origin: string) {
  return (
    origin === PRODUCTION_ORIGIN ||
    NATIVE_ORIGINS.has(origin) ||
    (process.env.NODE_ENV !== "production" && DEVELOPMENT_ORIGINS.has(origin))
  );
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Cache-Control": "private, no-store, max-age=0",
    Vary: "Origin",
  };
}

function response(request: NextRequest, body: object, status = 200) {
  const origin = request.headers.get("origin") ?? "";
  return NextResponse.json(body, {
    status,
    headers: allowedOrigin(origin) ? corsHeaders(origin) : { "Cache-Control": "no-store", Vary: "Origin" },
  });
}

function workproAuth() {
  const existing = getApps().find((app) => app.name === "workpro-token-verifier");
  const app = existing ?? initializeApp({ projectId: WORKPRO_PROJECT_ID }, "workpro-token-verifier");
  return getAuth(app);
}

function hubFirestore() {
  const existing = getApps().find((app) => app.name === "contractor-hub-directory");
  const app = existing ?? initializeApp({ projectId: HUB_PROJECT_ID }, "contractor-hub-directory");
  return getFirestore(app);
}

async function approvedWorkProProfile(idToken: string, email: string) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${WORKPRO_PROJECT_ID}` +
    `/databases/(default)/documents/users/${encodeURIComponent(email.toLowerCase())}`;
  const profileResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });
  if (!profileResponse.ok) return false;
  const profile = (await profileResponse.json()) as {
    fields?: { status?: { stringValue?: string } };
  };
  return profile.fields?.status?.stringValue?.toLowerCase() === "approved";
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigin(origin)) return response(request, { error: "Origin not allowed" }, 403);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigin(origin)) return response(request, { error: "Origin not allowed" }, 403);

  const authorization = request.headers.get("authorization") ?? "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!idToken) return response(request, { error: "BPM authentication required" }, 401);

  try {
    const identity = await workproAuth().verifyIdToken(idToken);
    const email = String(identity.email ?? "").trim().toLowerCase();
    if (!email || !(await approvedWorkProProfile(idToken, email))) {
      return response(request, { error: "Approved BPM account required" }, 403);
    }

    const snapshot = await hubFirestore().doc("appState/berinda-group").get();
    const rows = snapshot.exists && Array.isArray(snapshot.data()?.contractorRows)
      ? snapshot.data()?.contractorRows
      : [];
    const contractors = rows
      .map((contractor: Record<string, unknown>) => ({
        id: String(contractor.id ?? ""),
        name: String(contractor.name ?? ""),
        trade: String(contractor.trade ?? ""),
        grade: String(contractor.grade ?? ""),
        location: String(contractor.location ?? ""),
        score: typeof contractor.score === "number" ? contractor.score : String(contractor.score ?? ""),
        status: String(contractor.status ?? ""),
        preqDate: String(contractor.preqDate ?? ""),
      }))
      .filter((contractor: { id: string; name: string }) => contractor.id && contractor.name)
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

    return response(request, { contractors, count: contractors.length });
  } catch (error) {
    console.error("WorkPro contractor directory request rejected", error);
    return response(request, { error: "Contractor directory unavailable" }, 401);
  }
}
