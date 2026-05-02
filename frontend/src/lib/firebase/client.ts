import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Data Connect はクライアントから直接叩かず、必ず Next.js API Route を経由して
// firebase-admin/data-connect (server) で実行する設計。理由:
//   - PUBLIC operation を一切公開せず、@auth(NO_ACCESS|USER) で全 operation を保護できる
//   - server で impersonate.authClaims を使えば auth コンテキストを渡せる
//   - クライアント側 SDK の "シングルトン Auth" 状態に振り回されない

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
};

const app = getApps().length ? getApp() : initializeApp(config);

export const auth = getAuth(app);
export const storage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && typeof window !== "undefined") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
