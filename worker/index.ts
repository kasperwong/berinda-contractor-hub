/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  DOCUMENTS: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const FIREBASE_API_KEY = "AIzaSyBumpCKjW8z4LfXgdP9No_ItMKTE4-Wlsg";
const FIREBASE_PROJECT_ID = "berinda-contractor-hub";
const DOCUMENT_EDITOR_ROLES = new Set([
  "admin",
  "editor",
  "group_admin",
  "company_admin",
]);

type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  active: boolean;
};

async function authenticateFirebaseUser(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!token) return null;

  const identityResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );
  if (!identityResponse.ok) return null;
  const identity = (await identityResponse.json()) as {
    users?: Array<{ localId?: string; email?: string }>;
  };
  const firebaseUser = identity.users?.[0];
  if (!firebaseUser?.localId) return null;

  const profileResponse = await fetch(
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(firebaseUser.localId)}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!profileResponse.ok) return null;
  const profile = (await profileResponse.json()) as {
    fields?: {
      active?: { booleanValue?: boolean };
      role?: { stringValue?: string };
    };
  };
  return {
    id: firebaseUser.localId,
    email: firebaseUser.email ?? "",
    role: profile.fields?.role?.stringValue ?? "viewer",
    active: profile.fields?.active?.booleanValue === true,
  };
}

function documentObjectKey(url: URL) {
  const match = url.pathname.match(
    /^\/api\/contractor-documents\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)$/,
  );
  return match
    ? `contractor-documents/${match[1]}/${match[2]}/file`
    : null;
}

async function handleContractorDocument(
  request: Request,
  env: Env,
  key: string,
) {
  const user = await authenticateFirebaseUser(request);
  if (!user?.active)
    return new Response("Authentication required", { status: 401 });

  if (request.method === "GET") {
    const object = await env.DOCUMENTS.get(key);
    if (!object) return new Response("Document not found", { status: 404 });
    const headers = new Headers({
      "cache-control": "private, no-store",
      "content-type": "application/octet-stream",
      "x-content-type-options": "nosniff",
    });
    object.writeHttpMetadata(headers);
    return new Response(object.body, { headers });
  }

  if (!DOCUMENT_EDITOR_ROLES.has(user.role))
    return new Response("Editor access required", { status: 403 });

  if (request.method === "POST") {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (!request.body || contentLength > 25 * 1024 * 1024)
      return new Response("Document must be 25 MB or smaller", {
        status: 413,
      });
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > 25 * 1024 * 1024)
      return new Response("Document must be 25 MB or smaller", {
        status: 413,
      });
    await env.DOCUMENTS.put(key, bytes, {
      httpMetadata: {
        contentType:
          request.headers.get("content-type") ?? "application/octet-stream",
      },
      customMetadata: { uploadedBy: user.email || user.id },
    });
    return new Response(null, { status: 204 });
  }

  if (request.method === "DELETE") {
    const existing = await env.DOCUMENTS.head(key);
    if (!existing) return new Response("Document not found", { status: 404 });
    await env.DOCUMENTS.delete(key);
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { allow: "GET, POST, DELETE" },
  });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const documentKey = documentObjectKey(url);
    if (documentKey)
      return handleContractorDocument(request, env, documentKey);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
