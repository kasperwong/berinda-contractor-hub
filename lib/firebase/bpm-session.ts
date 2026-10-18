"use client";

import { signInWithCustomToken, signOut } from "firebase/auth";
import { getBpmAuth, getFirebaseClient } from "./client";
import { BPM_HANDOFF_KEY, BPM_ORIGINS, trustedBpmMessage, validHandoffId } from "../auth/bpm-handoff";

let renewal: Promise<void> | null = null;
let sessionVersion = 0;
let listening = false;

export function hasBpmHandoff() {
  const url = new URL(window.location.href);
  const requestId = url.searchParams.get("bpmRequest");
  if (validHandoffId(requestId) && window.opener) {
    window.sessionStorage.setItem(BPM_HANDOFF_KEY, requestId);
    url.searchParams.delete("bpmRequest");
    window.history.replaceState(window.history.state, "", url);
  }
  const saved = window.sessionStorage.getItem(BPM_HANDOFF_KEY);
  if (!listening) {
    listening = true;
    window.addEventListener("message", event => {
      const id = window.sessionStorage.getItem(BPM_HANDOFF_KEY);
      if (id && trustedBpmMessage(event, window.opener, id) && event.data.type === "berinda.bpm.signed-out") {
        void signOutHubAccount();
      }
    });
  }
  return validHandoffId(saved) && !!window.opener;
}

function requestBpmToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestId = window.sessionStorage.getItem(BPM_HANDOFF_KEY)!;
    const opener = window.opener;
    const cleanup = () => { window.clearTimeout(timeout); window.removeEventListener("message", receive); };
    const receive = (event: MessageEvent) => {
      if (!trustedBpmMessage(event, opener, requestId) || event.data.type !== "berinda.bpm.token.response") return;
      cleanup();
      if (typeof event.data.token === "string" && event.data.token.length > 100 && event.data.token.length < 16000) resolve(event.data.token);
      else reject(new Error("Return to BPM and open Contractor Hub again using an approved account."));
    };
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error("The BPM session is unavailable. Return to BPM and open Contractor Hub again.")); }, 20000);
    window.addEventListener("message", receive);
    for (const origin of BPM_ORIGINS) opener.postMessage({ type: "berinda.bpm.token.request", requestId }, origin);
  });
}

export function renewBpmSession() {
  if (renewal) return renewal;
  const version = sessionVersion;
  renewal = (async () => {
    let idToken: string;
    if (hasBpmHandoff()) idToken = await requestBpmToken();
    else {
      const bpmAuth = getBpmAuth();
      await bpmAuth.authStateReady();
      if (!bpmAuth.currentUser) throw new Error("Please sign in with your BPM account again.");
      idToken = await bpmAuth.currentUser.getIdToken(true);
    }
    const response = await fetch("/api/auth/bpm", {
      method: "POST", headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store", signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Your BPM access could not be verified.");
    if (version !== sessionVersion) throw new Error("Sign-in was cancelled.");
    await signInWithCustomToken(getFirebaseClient().auth, result.customToken);
    if (version !== sessionVersion) await signOut(getFirebaseClient().auth);
  })().finally(() => { renewal = null; });
  return renewal;
}

export async function signOutHubAccount() {
  sessionVersion++;
  window.sessionStorage.removeItem(BPM_HANDOFF_KEY);
  await Promise.all([signOut(getFirebaseClient().auth), signOut(getBpmAuth())]);
}
