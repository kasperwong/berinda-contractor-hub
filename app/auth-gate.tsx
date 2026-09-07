"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updatePassword,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";

const EMAIL_KEY = "berinda-auth-email";
const ACTION_SETTINGS = {
  url:
    typeof window === "undefined"
      ? "https://contractor-hub--berinda-contractor-hub.asia-southeast1.hosted.app/"
      : window.location.origin,
  handleCodeInApp: true,
};

type Profile = {
  role?: "admin" | "editor" | "viewer";
  active?: boolean;
  companyName?: string;
  status?: string;
  email?: string;
  displayName?: string;
  phone?: string;
  mustChangePassword?: boolean;
};

type AccessRequest = {
  id: string;
  email: string;
  requestedAt?: { seconds?: number };
};

type ManagedRole = NonNullable<Profile["role"]>;

type ManagedUser = {
  id: string;
  email: string;
  role: ManagedRole;
  active: boolean;
};

const MANAGED_ROLES: Array<{ value: ManagedRole; label: string }> = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

export const AuthProfileContext = createContext<Profile | null>(null);
export function useAuthProfile() {
  return useContext(AuthProfileContext);
}

function firebaseMessage(error: unknown, fallback: string) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  if (code.includes("invalid-credential") || code.includes("wrong-password")) {
    return "The email address or password is incorrect.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  if (code.includes("network-request-failed")) {
    return "The sign-in service could not be reached. Check your connection and try again.";
  }
  if (code.includes("weak-password")) {
    return "Use a password with at least 8 characters.";
  }
  return fallback;
}

function AdminUserPanel({ auth, db, onClose }: {
  auth: ReturnType<typeof getFirebaseClient>["auth"];
  db: ReturnType<typeof getFirebaseClient>["db"];
  onClose: () => void;
}) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [busy, setBusy] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");
  const [managementMessage, setManagementMessage] = useState("");
  const [managementError, setManagementError] = useState("");

  const load = async () => {
    const [requestSnapshot, userSnapshot] = await Promise.all([
      getDocs(query(collection(db, "accessRequests"), where("status", "==", "pending"))),
      getDocs(query(collection(db, "users"), where("groupId", "==", "berinda-group"))),
    ]);
    setRequests(requestSnapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<AccessRequest, "id">),
    })));
    setUsers(userSnapshot.docs.map((item) => {
      const data = item.data() as Partial<ManagedUser>;
      return {
        id: item.id,
        email: data.email ?? "Email not recorded",
        role: data.role && MANAGED_ROLES.some((role) => role.value === data.role) ? data.role : "viewer",
        active: data.active === true,
      };
    }).filter((account) => account.active).sort((a, b) => a.email.localeCompare(b.email)));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getDocs(query(collection(db, "accessRequests"), where("status", "==", "pending"))),
      getDocs(query(collection(db, "users"), where("groupId", "==", "berinda-group"))),
    ]).then(([requestSnapshot, userSnapshot]) => {
      if (!cancelled) {
        setRequests(requestSnapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<AccessRequest, "id">),
        })));
        setUsers(userSnapshot.docs.map((item) => {
          const data = item.data() as Partial<ManagedUser>;
          return {
            id: item.id,
            email: data.email ?? "Email not recorded",
            role: data.role && MANAGED_ROLES.some((role) => role.value === data.role) ? data.role : "viewer",
            active: data.active === true,
          };
        }).filter((account) => account.active).sort((a, b) => a.email.localeCompare(b.email)));
      }
    });
    return () => { cancelled = true; };
  }, [db]);

  async function approve(request: AccessRequest) {
    setBusy(request.id);
    await setDoc(doc(db, "users", request.id), {
      id: request.id,
      email: request.email,
      role: "viewer",
      active: true,
      groupId: "berinda-group",
      companyId: "pending",
      createdAt: serverTimestamp(),
    }, { merge: true });
    await updateDoc(doc(db, "accessRequests", request.id), {
      status: "approved",
      reviewedAt: serverTimestamp(),
    });
    await load();
    setBusy("");
  }

  async function reject(request: AccessRequest) {
    setBusy(request.id);
    await updateDoc(doc(db, "accessRequests", request.id), {
      status: "rejected",
      reviewedAt: serverTimestamp(),
    });
    await load();
    setBusy("");
  }

  async function createPasswordAccount(event: React.FormEvent) {
    event.preventDefault();
    setCreateMessage("");
    setCreateError("");
    const normalized = inviteEmail.trim().toLowerCase();
    if (!normalized.includes("@")) {
      setCreateError("Enter the user's company email address.");
      return;
    }
    if (temporaryPassword.length < 8) {
      setCreateError("Use a temporary password with at least 8 characters.");
      return;
    }

    const apiKey = auth.app.options.apiKey;
    if (!apiKey) {
      setCreateError("Firebase account creation is not configured.");
      return;
    }

    setBusy("create-account");
    let createdToken = "";
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalized, password: temporaryPassword, returnSecureToken: true }),
        },
      );
      const result = (await response.json()) as {
        localId?: string;
        idToken?: string;
        error?: { message?: string };
      };
      if (!response.ok || !result.localId) {
        if (result.error?.message === "EMAIL_EXISTS") throw new Error("EMAIL_EXISTS");
        throw new Error(result.error?.message || "CREATE_FAILED");
      }

      createdToken = result.idToken ?? "";
      try {
        await setDoc(doc(db, "users", result.localId), {
          id: result.localId,
          email: normalized,
          role: "viewer",
          active: true,
          groupId: "berinda-group",
          companyId: "pending",
          mustChangePassword: true,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid ?? "admin",
        });
      } catch (profileError) {
        if (createdToken) {
          await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: createdToken }),
            },
          ).catch(() => undefined);
        }
        throw profileError;
      }

      setCreateMessage(
        `Account created for ${normalized}. Share the temporary password privately; the user must replace it after signing in.`,
      );
      setInviteEmail("");
      setTemporaryPassword("");
      await load();
    } catch (error) {
      setCreateError(
        error instanceof Error && error.message === "EMAIL_EXISTS"
          ? "An authentication account already exists for this email address."
          : firebaseMessage(error, "The account could not be created. Try again or contact the system administrator."),
      );
    } finally {
      setBusy("");
    }
  }

  async function changeRole(account: ManagedUser, nextRole: ManagedRole) {
    setManagementMessage("");
    setManagementError("");
    if (account.id === auth.currentUser?.uid) {
      setManagementError("You cannot change your own administrator role here.");
      return;
    }

    setBusy(`role-${account.id}`);
    try {
      await updateDoc(doc(db, "users", account.id), {
        role: nextRole,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid ?? "admin",
      });
      setUsers((current) => current.map((item) => (
        item.id === account.id ? { ...item, role: nextRole } : item
      )));
      setManagementMessage(`${account.email} is now ${nextRole === "admin" ? "an Admin" : `an ${nextRole === "editor" ? "Editor" : "Viewer"}`}.`);
    } catch {
      setManagementError("The role could not be updated. Try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="admin-panel-backdrop">
      <section className="admin-panel" aria-labelledby="user-management-title">
        <div className="admin-panel-head">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h2 id="user-management-title">User management</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close user management">×</button>
        </div>

        <div className="admin-create-account">
          <div>
            <h3>Create password account</h3>
            <p>Use this when company email security blocks the passwordless sign-in link.</p>
          </div>
          <form onSubmit={createPasswordAccount}>
            <label>
              Company email
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="name@company.com"
                autoComplete="off"
                required
              />
            </label>
            <label>
              Temporary password
              <input
                type="password"
                value={temporaryPassword}
                onChange={(event) => setTemporaryPassword(event.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={busy === "create-account"}>
              {busy === "create-account" ? "Creating account…" : "Create viewer account"}
            </button>
          </form>
          {createMessage && <div className="auth-message success">{createMessage}</div>}
          {createError && <div className="auth-message error">{createError}</div>}
        </div>

        <div className="admin-pending-head">
          <h3>Active users</h3>
          <p>Choose the access level each person needs. Your own administrator role is protected.</p>
        </div>
        {managementMessage && <div className="auth-message success">{managementMessage}</div>}
        {managementError && <div className="auth-message error">{managementError}</div>}
        {users.length === 0 ? (
          <div className="auth-message">No active users found.</div>
        ) : (
          <div className="admin-user-list">
            {users.map((account) => {
              const isCurrentUser = account.id === auth.currentUser?.uid;
              return (
                <div className="admin-user-row" key={account.id}>
                  <div>
                    <strong>{account.email}</strong>
                    <small>{isCurrentUser ? "Your account" : "Active account"}</small>
                  </div>
                  <label>
                    <select
                      value={account.role}
                      disabled={isCurrentUser || busy === `role-${account.id}`}
                      onChange={(event) => void changeRole(account, event.target.value as ManagedRole)}
                      aria-label={`Role for ${account.email}`}
                    >
                      {MANAGED_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-pending-head">
          <h3>Pending email-link requests</h3>
          <p>New requests are approved as Viewer by default.</p>
        </div>
        {requests.length === 0 ? (
          <div className="auth-message success">No pending access requests.</div>
        ) : (
          <div className="admin-request-list">
            {requests.map((request) => (
              <div className="admin-request" key={request.id}>
                <div>
                  <strong>{request.email}</strong>
                  <small>Pending approval</small>
                </div>
                <div>
                  <button className="secondary-button" disabled={busy === request.id} onClick={() => void reject(request)}>
                    Reject
                  </button>
                  <button className="primary-button" disabled={busy === request.id} onClick={() => void approve(request)}>
                    Approve as Viewer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ChangeTemporaryPassword({ user, auth, db, onComplete }: {
  user: User;
  auth: ReturnType<typeof getFirebaseClient>["auth"];
  db: ReturnType<typeof getFirebaseClient>["db"];
  onComplete: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (newPassword.length < 8) {
      setMessage("Use a new password with at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("The new passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await updatePassword(user, newPassword);
      await updateDoc(doc(db, "users", user.uid), {
        mustChangePassword: false,
        passwordChangedAt: serverTimestamp(),
      });
      onComplete();
    } catch (error) {
      setMessage(firebaseMessage(error, "The password could not be changed. Sign out and try again."));
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <p className="eyebrow">FIRST SIGN-IN</p>
        <h1>Create your password</h1>
        <p>Replace the temporary password before entering the contractor workspace.</p>
        <form onSubmit={save}>
          <label>
            New password
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} autoComplete="new-password" required />
          </label>
          <label>
            Confirm new password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} autoComplete="new-password" required />
          </label>
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "Saving password…" : "Save password and continue"}
          </button>
        </form>
        {message && <div className="auth-message error">{message}</div>}
        <button className="auth-text-button" onClick={() => signOut(auth)}>Sign out</button>
      </section>
    </main>
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"password" | "email-link">("password");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { auth, db } = getFirebaseClient();

  useEffect(() => {
    const openAccountMenu = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[aria-label="Open user menu"]')) {
        event.preventDefault();
        event.stopPropagation();
        setShowAccountMenu((current) => !current);
      }
    };
    document.addEventListener("click", openAccountMenu, true);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem(EMAIL_KEY) ?? window.prompt("Confirm your company email") ?? "";
      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => window.localStorage.removeItem(EMAIL_KEY))
          .catch(() => setMessage("This sign-in link has expired. Please request a new one."));
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const profileSnapshot = await getDoc(doc(db, "users", nextUser.uid));
        setProfile(profileSnapshot.exists() ? (profileSnapshot.data() as Profile) : null);
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
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      document.removeEventListener("click", openAccountMenu, true);
      unsubscribe();
    };
  }, [auth, db]);

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) {
      setMessage("Enter your company email address.");
      return;
    }
    setBusy(true);
    try {
      await sendSignInLinkToEmail(auth, normalized, ACTION_SETTINGS);
      window.localStorage.setItem(EMAIL_KEY, normalized);
      setSent(true);
    } catch (error) {
      setMessage(firebaseMessage(error, "The sign-in email could not be sent. Use password sign-in or ask an administrator for help."));
    } finally {
      setBusy(false);
    }
  }

  async function signInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@") || !password) {
      setMessage("Enter your company email address and password.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, normalized, password);
    } catch (error) {
      setMessage(firebaseMessage(error, "The email address or password is incorrect."));
      setBusy(false);
    }
  }

  if (loading) return <div className="auth-screen"><div className="auth-card"><strong>Loading secure workspace…</strong></div></div>;

  if (!user) {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <p className="eyebrow">BERINDA CONTRACTOR HUB</p>
          <h1>Secure company access</h1>
          <p>Sign in with an administrator-issued password or request a secure email link.</p>

          <div className="auth-mode-switch" role="tablist" aria-label="Sign-in method">
            <button type="button" role="tab" aria-selected={authMode === "password"} className={authMode === "password" ? "active" : ""} onClick={() => { setAuthMode("password"); setMessage(""); }}>
              Password
            </button>
            <button type="button" role="tab" aria-selected={authMode === "email-link"} className={authMode === "email-link" ? "active" : ""} onClick={() => { setAuthMode("email-link"); setMessage(""); }}>
              Email link
            </button>
          </div>

          {authMode === "password" ? (
            <form onSubmit={signInWithPassword}>
              <label>
                Company email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@yourcompany.com" autoComplete="username" required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              </label>
              <button className="primary-button" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            </form>
          ) : sent ? (
            <div className="auth-message success">A sign-in link was sent to <strong>{email}</strong>. Open it on this device to continue.</div>
          ) : (
            <form onSubmit={requestLink}>
              <label>
                Company email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@yourcompany.com" autoComplete="email" required />
              </label>
              <button className="primary-button" type="submit" disabled={busy}>{busy ? "Sending link…" : "Send secure sign-in link"}</button>
            </form>
          )}
          {message && <div className="auth-message error">{message}</div>}
        </section>
      </main>
    );
  }

  if (!profile || profile.active !== true) {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <p className="eyebrow">ACCESS REQUEST</p>
          <h1>Waiting for approval</h1>
          <p>Your company email is verified, but an administrator must approve your access.</p>
          <button className="secondary-button" onClick={() => signOut(auth)}>Use another account</button>
        </section>
      </main>
    );
  }

  if (profile.mustChangePassword) {
    return <ChangeTemporaryPassword user={user} auth={auth} db={db} onComplete={() => setProfile((current) => ({ ...current, mustChangePassword: false }))} />;
  }

  const profileWithIdentity = {
    ...profile,
    email: user.email ?? profile.email ?? "",
    displayName: profile.displayName ?? user.displayName ?? "",
  };

  return (
    <AuthProfileContext.Provider value={profileWithIdentity}>
      <>
        {children}
        {showAccountMenu && (
          <div className="account-menu-popover">
            <div><strong>{user.email}</strong><small>{profile.role} access</small></div>
            {profile.role === "admin" && <button onClick={() => { setShowAdmin(true); setShowAccountMenu(false); }}>User management</button>}
            <button onClick={() => signOut(auth)}>Sign out</button>
          </div>
        )}
        {showAdmin && <AdminUserPanel auth={auth} db={db} onClose={() => setShowAdmin(false)} />}
      </>
    </AuthProfileContext.Provider>
  );
}
