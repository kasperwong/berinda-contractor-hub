"use client";

import { signInWithCustomToken, signOut } from "firebase/auth";
import { getBpmAuth, getFirebaseClient } from "./client";

let renewal: Promise<void> | null = null;
let sessionVersion = 0;

export function renewBpmSession() {
  if (renewal) return renewal;
  const version = sessionVersion;
  renewal = (async () => {
    const bpmAuth = getBpmAuth();
    await bpmAuth.authStateReady();
    if (!bpmAuth.currentUser) throw new Error("Please sign in with your BPM account again.");
    const idToken = await bpmAuth.currentUser.getIdToken(true);
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
  await Promise.all([signOut(getFirebaseClient().auth), signOut(getBpmAuth())]);
}
