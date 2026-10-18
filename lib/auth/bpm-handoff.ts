export const BPM_ORIGINS = [
  "https://berinda-project-management.web.app",
  "https://berinda-project-management.firebaseapp.com",
] as const;
export const BPM_HANDOFF_KEY = "berinda-bpm-handoff";

export function validHandoffId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function trustedBpmMessage(event: { origin: string; source: unknown; data: unknown },
  opener: unknown, requestId: string) {
  if (!opener || event.source !== opener || !BPM_ORIGINS.some(origin => origin === event.origin) || !validHandoffId(requestId)) return false;
  const data = event.data as Record<string, unknown> | null;
  return !!data && data.requestId === requestId;
}
