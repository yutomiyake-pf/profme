import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDataConnectEmulator, getDataConnect } from "firebase/data-connect";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectorConfig } from "@dataconnect/generated";

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
export const dataConnect = getDataConnect(app, connectorConfig);

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
  typeof window !== "undefined"
) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectDataConnectEmulator(dataConnect, "127.0.0.1", 9399);
}
