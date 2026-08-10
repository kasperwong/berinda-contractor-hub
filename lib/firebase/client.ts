"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

type FirebaseClient = { app: FirebaseApp; db: Firestore; auth: Auth };

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing Firebase configuration: ${name}`);
  return value;
}

export function getFirebaseClient(): FirebaseClient {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBumpCKjW8z4LfXgdP9No_ItMKTE4-Wlsg",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "berinda-contractor-hub.firebaseapp.com",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "berinda-contractor-hub",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:1077059405196:web:c53bdf718fcb9031e302a9",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "1077059405196",
      });

  return { app, db: getFirestore(app), auth: getAuth(app) };
}
