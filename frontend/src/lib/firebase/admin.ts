import "server-only";

import { cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getStorage as getAdminStorage } from "firebase-admin/storage";

import {
  getApps as getFirebaseApps,
  initializeApp as initializeFirebaseApp,
} from "firebase/app";
import { connectDataConnectEmulator, getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/generated";

// --------------------------------------------------------------------------
// Firebase Admin SDK (Auth / Storage)
// --------------------------------------------------------------------------
// firebase-admin の Auth/Storage はエミュレータ用の env が立っていれば
// 自動的にそちらへ接続する (FIREBASE_AUTH_EMULATOR_HOST /
// FIREBASE_STORAGE_EMULATOR_HOST)。明示的な connectXxxEmulator は無い。

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

const adminApp = getAdminApps().length
  ? getAdminApps()[0]
  : initializeAdminApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

export const adminAuth = getAdminAuth(adminApp);
export const adminStorage = getAdminStorage(adminApp);

// --------------------------------------------------------------------------
// Firebase Data Connect (server-side)
// --------------------------------------------------------------------------
// Data Connect は firebase-admin に対応する API がないため、サーバ側でも
// firebase/data-connect (クライアント SDK) を使う。Next.js の API Route は
// Node ランタイムなのでそのまま動く。
//
// 認可: @auth(level: USER) の operation を呼ぶ場合は、ユーザの ID Token を
// 明示的に渡す必要がある (firebase-admin の verifySessionCookie で取った
// セッションから ID Token を再取得 or 別経路で）。本ファイルでは
// dataConnect インスタンスのみ用意し、auth 文脈は呼び出し側で組み立てる。

const SERVER_DC_APP_NAME = "[server-data-connect]";

const dcApp =
  getFirebaseApps().find((a) => a.name === SERVER_DC_APP_NAME) ??
  initializeFirebaseApp(
    { projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID },
    SERVER_DC_APP_NAME,
  );

export const dataConnect = getDataConnect(dcApp, connectorConfig);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  const [host, port] = (process.env.DATA_CONNECT_EMULATOR_HOST ?? "127.0.0.1:9399").split(":");
  connectDataConnectEmulator(dataConnect, host, Number(port));
}
