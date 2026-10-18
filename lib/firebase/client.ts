"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

type FirebaseClient = {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
};

export function getFirebaseClient(): FirebaseClient {
  const app = getApps().some((app) => app.name === "[DEFAULT]")
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBumpCKjW8z4LfXgdP9No_ItMKTE4-Wlsg",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "berinda-contractor-hub.firebaseapp.com",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "berinda-contractor-hub",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:1077059405196:web:c53bdf718fcb9031e302a9",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "1077059405196",
      });

  return {
    app,
    db: getFirestore(app),
    auth: getAuth(app),
  };
}

export function getBpmAuth() {
  const app = getApps().find((app) => app.name === "bpm-sign-in") ?? initializeApp({
    apiKey: "AIzaSyD6MHXvKfvg0Ms1b6BZj5jfRhXkE7y-YH4",
    authDomain: "berinda-project-management.firebaseapp.com",
    projectId: "berinda-project-management",
    appId: "1:393176226794:web:c861f09a86aa31806ef093",
  }, "bpm-sign-in");
  return getAuth(app);
}
