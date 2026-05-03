---
name: firebase-basics
description: Firebase 全体の基礎。プロジェクト構造、SDK の使い分け、CLI、Emulator Suite を扱う際に参照する。
---

# Firebase Basics

Profme では Firebase を **Auth (電話番号認証)** / **Data Connect (Cloud SQL)** / **Cloud Storage** の 3 つで利用する。本スキルは個別プロダクトに踏み込む前の共通知識をまとめる。

## SDK の使い分け

| SDK              | パッケージ       | 用途                                                                                                            |
| ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| クライアント SDK | `firebase`       | ブラウザ上での認証・Storage 直アップロード・Data Connect クエリ                                                 |
| Admin SDK        | `firebase-admin` | Next.js のサーバ (API Route / Server Components) での ID Token 検証・セッション Cookie 発行・Admin 権限での操作 |

クライアント SDK は **公開可能** な `apiKey` 等で初期化（プロジェクトを識別するだけのキーで、認可は Security Rules が担う）。Admin SDK は **サービスアカウント JSON が必須**。サーバ側でのみ使う。

## プロジェクト識別子

- `projectId` … `profme-dev` など。`firebase use` で alias を切り替えるとプロジェクトが切り替わる
- `appId` … プロジェクト内の各アプリ (Web / iOS / Android) を識別する ID
- `apiKey` … Web 用の公開鍵。クライアントに埋めて OK

`.firebaserc` は alias とプロジェクトの対応表。`firebase init` 時に生成される。

## Firebase CLI

```bash
npm i -D firebase-tools             # ローカルにバージョン固定
npx firebase login                  # OAuth でログイン
npx firebase init                   # プロジェクト初期化（1 度だけ）
npx firebase use --add profme-prod  # 追加 alias を登録
```

主要サブコマンド:

- `firebase emulators:start` — エミュレータスイート起動
- `firebase deploy --only hosting,functions,dataconnect` — 部分デプロイ
- `firebase dataconnect:sdk:generate` — Data Connect SDK 再生成

## Emulator Suite

ローカル開発を本番から完全に切り離せる。`firebase.json` の `emulators` で各エミュレータのポートを指定:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "dataconnect": { "port": 9399 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 },
    "singleProjectMode": true
  }
}
```

ブラウザで `http://127.0.0.1:4000` を開くと Emulator UI が立ち上がり、ユーザ追加・データ確認・Storage アップロード状況などが見られる。

クライアント SDK 側では `connectAuthEmulator(auth, "http://127.0.0.1:9099")` 等で接続を切り替える。Admin SDK は環境変数 `FIREBASE_AUTH_EMULATOR_HOST` などが立っていれば自動で繋がる。

## デプロイの種類

- **App Hosting** … Next.js (SSR) を含むフルスタック Web アプリ向け。Cloud Run ベース
- **Firestore / Data Connect** … スキーマや Rules を `firebase deploy --only ...` で本番反映
- **Storage** … Rules を `firebase deploy --only storage` で反映

## 落とし穴

- **Edge Runtime と Admin SDK は両立しない**: `firebase-admin` は Node でしか動かない。認証検証する Route には `export const runtime = "nodejs"` を必ず指定
- **2 度初期化を避ける**: HMR 環境で `initializeApp` が複数回呼ばれるとエラー。`getApps().length ? getApp() : initializeApp(...)` のパターンで防ぐ
- **環境変数の境界**: `NEXT_PUBLIC_` 接頭辞があるものだけがクライアントに渡る。サービスアカウントは絶対に `NEXT_PUBLIC_` を付けない

## 参考リンク

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- プロジェクト内設計書: `frontend/docs/local_setup.md`
