"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseClient = { app: FirebaseApp; db: Firestore };

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing Firebase configuration: ${name}`);
  return value;
}

export function getFirebaseClient(): FirebaseClient {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: required("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        authDomain: required("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
        projectId: required("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        appId: required("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
        messagingSenderId: required(
          "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        ),
      });

  return { app, db: getFirestore(app) };
}
