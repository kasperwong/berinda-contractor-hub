"use client";

import { useEffect, useState } from "react";
import { isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signOut, type User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp, updateDoc, query, where } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";

const EMAIL_KEY = "berinda-auth-email";
const ACTION_SETTINGS = { url: typeof window === "undefined" ? "https://contractor-hub--berinda-contractor-hub.asia-southeast1.hosted.app/" : window.location.origin, handleCodeInApp: true };

type Profile = { role?: "admin" | "editor" | "viewer"; active?: boolean; companyName?: string; status?: string };

function AdminUserPanel({ auth, db, onClose }: { auth: ReturnType<typeof getFirebaseClient>["auth"]; db: ReturnType<typeof getFirebaseClient>["db"]; onClose: () => void }) {
  const [requests, setRequests] = useState<Array<{ id: string; email: string; requestedAt?: { seconds?: number } }>>([]);
  const [busy, setBusy] = useState("");
  const load = async () => {
    const snapshot = await getDocs(query(collection(db, "accessRequests"), where("status", "==", "pending")));
    setRequests(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as { email?: string; requestedAt?: { seconds?: number } }) })) as Array<{ id: string; email: string; requestedAt?: { seconds?: number } }>);
  };
  useEffect(() => { void load(); }, []);
  async function approve(request: { id: string; email: string }) {
    setBusy(request.id);
    await setDoc(doc(db, "users", request.id), { id: request.id, email: request.email, role: "viewer", active: true, groupId: "berinda-group", companyId: "pending", createdAt: serverTimestamp() }, { merge: true });
    await updateDoc(doc(db, "accessRequests", request.id), { status: "approved", reviewedAt: serverTimestamp() });
    await load(); setBusy("");
  }
  async function reject(request: { id: string }) {
    setBusy(request.id); await updateDoc(doc(db, "accessRequests", request.id), { status: "rejected", reviewedAt: serverTimestamp() }); await load(); setBusy("");
  }
  return <div className="admin-panel-backdrop"><section className="admin-panel"><div className="admin-panel-head"><div><p className="eyebrow">ADMINISTRATION</p><h2>User management</h2></div><button className="icon-button" onClick={onClose} aria-label="Close user management">×</button></div><p>Approve company-email requests and assign access. New users are approved as Viewer by default; you can edit their role in Firestore.</p>{requests.length === 0 ? <div className="auth-message success">No pending access requests.</div> : <div className="admin-request-list">{requests.map((request) => <div className="admin-request" key={request.id}><div><strong>{request.email}</strong><small>Pending approval</small></div><div><button className="secondary-button" disabled={busy === request.id} onClick={() => void reject(request)}>Reject</button><button className="primary-button" disabled={busy === request.id} onClick={() => void approve(request)}>Approve as Viewer</button></div></div>)}</div>}</section></div>;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { auth, db } = getFirebaseClient();

  useEffect(() => {
    const openAccountMenu = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[aria-label="Open user menu"]')) {
        event.preventDefault(); event.stopPropagation(); setShowAccountMenu((current) => !current);
      }
    };
    document.addEventListener("click", openAccountMenu, true);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem(EMAIL_KEY) ?? window.prompt("Confirm your company email") ?? "";
      if (savedEmail) signInWithEmailLink(auth, savedEmail, window.location.href).then(() => window.localStorage.removeItem(EMAIL_KEY)).catch(() => setMessage("This sign-in link has expired. Please request a new one."));
    }
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const profileSnapshot = await getDoc(doc(db, "users", nextUser.uid));
        setProfile(profileSnapshot.exists() ? profileSnapshot.data() as Profile : null);
        if (!profileSnapshot.exists()) {
          await setDoc(doc(db, "accessRequests", nextUser.uid), {
            id: nextUser.uid,
            email: nextUser.email ?? "",
            groupId: "berinda-group",
            companyId: "pending",
            requestedBy: nextUser.uid,
            status: "pending",
            requestedAt: serverTimestamp(),
          }, { merge: true });
        }
      } else setProfile(null);
      setLoading(false);
    });
    return () => { document.removeEventListener("click", openAccountMenu, true); unsubscribe(); };
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
  return <>{children}{showAccountMenu && <div className="account-menu-popover"><div><strong>{user.email}</strong><small>{profile.role} access</small></div>{profile.role === "admin" && <button onClick={() => { setShowAdmin(true); setShowAccountMenu(false); }}>User management</button>}<button onClick={() => signOut(auth)}>Sign out</button></div>}{showAdmin && <AdminUserPanel auth={auth} db={db} onClose={() => setShowAdmin(false)} />}</>;
}
