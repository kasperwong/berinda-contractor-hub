"use client";

import { useEffect, useState } from "react";
import { isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";

const EMAIL_KEY = "berinda-auth-email";
const ACTION_SETTINGS = { url: typeof window === "undefined" ? "https://contractor-hub--berinda-contractor-hub.asia-southeast1.hosted.app/" : window.location.origin, handleCodeInApp: true };

type Profile = { role?: "admin" | "editor" | "viewer"; active?: boolean; companyName?: string; status?: string };

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { auth, db } = getFirebaseClient();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem(EMAIL_KEY) ?? window.prompt("Confirm your company email") ?? "";
      if (savedEmail) signInWithEmailLink(auth, savedEmail, window.location.href).then(() => window.localStorage.removeItem(EMAIL_KEY)).catch(() => setMessage("This sign-in link has expired. Please request a new one."));
    }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const profileSnapshot = await getDoc(doc(db, "users", nextUser.uid));
        setProfile(profileSnapshot.exists() ? profileSnapshot.data() as Profile : null);
      } else setProfile(null);
      setLoading(false);
    });
  }, [auth, db]);

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) { setMessage("Enter your company email address."); return; }
    try {
      await sendSignInLinkToEmail(auth, normalized, ACTION_SETTINGS);
      window.localStorage.setItem(EMAIL_KEY, normalized);
      setSent(true);
    } catch { setMessage("Sign-in is not enabled yet. Ask an administrator to enable Email link in Firebase Authentication."); }
  }

  if (loading) return <div className="auth-screen"><div className="auth-card"><strong>Loading secure workspace…</strong></div></div>;
  if (!user) return <main className="auth-screen"><section className="auth-card"><p className="eyebrow">BERINDA CONTRACTOR HUB</p><h1>Secure company access</h1><p>Use your approved company email. No password or public registration is required.</p>{sent ? <div className="auth-message success">A sign-in link was sent to <strong>{email}</strong>. Open it on this device to continue.</div> : <form onSubmit={requestLink}><label>Company email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@yourcompany.com" required /></label><button className="primary-button" type="submit">Send secure sign-in link</button></form>}{message && <div className="auth-message error">{message}</div>}</section></main>;
  if (!profile || profile.active !== true) return <main className="auth-screen"><section className="auth-card"><p className="eyebrow">ACCESS REQUEST</p><h1>Waiting for approval</h1><p>Your company email is verified, but an administrator must approve your access before you can view contractor information.</p><button className="secondary-button" onClick={() => signOut(auth)}>Use another email</button></section></main>;
  return <>{children}</>;
}
