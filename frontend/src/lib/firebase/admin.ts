import "server-only";

import {
  cert,
  getApps as getAdminApps,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getDataConnect as getAdminDataConnect } from "firebase-admin/data-connect";
import { getStorage as getAdminStorage } from "firebase-admin/storage";
import { connectorConfig } from "@dataconnect/generated";

// --------------------------------------------------------------------------
// Firebase Admin SDK (Auth / Storage / Data Connect)
// --------------------------------------------------------------------------
// firebase-admin の Auth/Storage はエミュレータ用の env が立っていれば
// 自動的にそちらへ接続する (FIREBASE_AUTH_EMULATOR_HOST /
// FIREBASE_STORAGE_EMULATOR_HOST)。Data Connect も同様に
// DATA_CONNECT_EMULATOR_HOST を見て自動接続する。

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

const adminApp = getAdminApps().length
  ? getAdminApps()[0]
  : initializeAdminApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

export const adminAuth = getAdminAuth(adminApp);
export const adminStorage = getAdminStorage(adminApp);

// Data Connect は server からのみ admin SDK で呼ぶ:
//   - impersonate なし → admin 権限で実行 (NO_ACCESS な operation も通る)
//   - impersonate.authClaims → 指定ユーザの auth コンテキストで実行 (USER 用)
// 生成 SDK の関数 (updateMyProfile など) はクライアント SDK 用なので使わず、
// executeQuery / executeMutation を operation 名で呼ぶ。
export const dataConnectAdmin = getAdminDataConnect(
  {
    serviceId: connectorConfig.service,
    location: connectorConfig.location,
    connector: connectorConfig.connector,
  },
  adminApp,
);
