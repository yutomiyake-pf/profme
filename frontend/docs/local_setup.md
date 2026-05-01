# ローカル環境構築手順 — Firebase Auth (電話番号認証) + Data Connect + Storage + Next.js

このドキュメントは、Profme のローカル開発環境を立ち上げるための手順をまとめたものです。

- 認証: Firebase Authentication (電話番号認証)
- データベース: Firebase Data Connect (Cloud SQL for PostgreSQL)
- ストレージ: Firebase Cloud Storage (アバター画像、QR ダウンロード用画像 など)
- API: Next.js API Routes (App Router)
- 認証状態を **Server Components / API Route / Client** の三者で共有

## 全体アーキテクチャ

```
[Browser]                     [Next.js Server]                    [Firebase]
  Client SDK
  ─ 電話番号 + reCAPTCHA ─→
                              signInWithPhoneNumber                Auth Emulator
                              ←── SMS code (emulator UI で確認) ──
  ─ 認証コード入力 ──→
                              confirmationResult.confirm(code)
                              → User credential (ID Token)
  ── POST /api/auth/session ──→
                                         verifyIdToken
                                         createSessionCookie
                              ←── Set-Cookie: __session HttpOnly ──
  → 以降 Cookie で認証
                              cookies().get("__session")
                                  ─ verifySessionCookie ─→
                              ─── Data Connect SDK ────────→  Postgres (Emulator)
                              ─── Storage SDK ─────────────→  Cloud Storage (Emulator)
```

電話番号認証に固有なのは **(1) reCAPTCHA verifier をクライアントで初期化する** **(2) SMS コード入力の 2 段階フロー** の 2 点で、それ以降のサーバ側パターンは ID Token + セッション Cookie の標準的な流れと同じです。

画像は **クライアント SDK から直接アップロード**するのが基本パターンです。Storage Security Rules で `request.auth.uid` を見て本人のディレクトリだけに書き込めるように制限し、Next.js の API Route を経由させずに済ませます（API 経由にするとサーバが大量のバイナリを中継することになり遅くなる）。

## 前提

- Node.js 22.19.0 (`package.json#engines` に固定)
- npm 10+
- Google アカウント（Firebase コンソールへのアクセス用）
- Next.js 16 / React 19 / App Router (本リポジトリは既にセットアップ済み)

---

## 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. **Authentication > Sign-in method** で「電話番号」を有効化
   - 本番ドメインを「承認済みドメイン」に追加（`localhost` はデフォルトで許可）
3. **Authentication > Settings > Phone numbers for testing** にテスト用の電話番号と固定認証コードを登録（本番アカウントを消費せずに動作確認できる）
   - 例: `+81 90 0000 0000` / コード `123456`
4. **Data Connect** を有効化（GA。本番運用は Blaze プラン必須、ローカル開発はエミュレータで完結するので Spark プランでも進められる）
5. **Storage** を有効化
   - 「本番モード」を選んで初期化（あとで Security Rules を上書きする）
   - 既定バケット名は `<projectId>.appspot.com`

## 2. Firebase CLI とエミュレータ準備

```bash
cd frontend
npm i -D firebase-tools
npx firebase login
npx firebase init             # 対話の中で profme-dev を選ぶと .firebaserc が作られる
```

> **Note**: `firebase use --add` は `.firebaserc` がある状態（＝`firebase init` 済み）でないと
> `Error: firebase use must be run from a Firebase project directory.` で失敗する。
> 最初の紐付けは `firebase init` の中で行い、`firebase use --add` は後から
> dev / prod など複数環境を切り替えたいときの**追加**操作として使う。

`firebase init` で次を選択:

- **Authentication**
- **Data Connect**
- **Storage**
- **Emulators** → Authentication / Data Connect / Storage の 3 つを選択しデフォルトポートで OK

これで以下が生成される:

- `firebase.json` — エミュレータと Data Connect / Storage の設定
- `.firebaserc` — プロジェクト alias
- `dataconnect/` — スキーマ・コネクタ定義
- `storage.rules` — Cloud Storage のセキュリティルール

`firebase.json` の emulators 部分は典型的に下記:

```json
{
  "storage": { "rules": "storage.rules" },
  "emulators": {
    "auth": { "port": 9099 },
    "dataconnect": { "port": 9399, "dataDir": "./.dataconnect-emulator" },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 },
    "singleProjectMode": true
  }
}
```

## 3. Data Connect スキーマ定義

`dataconnect/schema/schema.gql` にアプリのデータモデルを GraphQL で定義する。Profme なら以下のようなエンティティ:

```graphql
type User @table {
  id: String! @col(name: "uid")          # Firebase Auth の uid と同期
  phoneNumber: String!
  displayName: String
  university: String
  faculty: String
  grade: String
  bio: String
  gakuchika: String
  cardTheme: String
  createdAt: Timestamp! @default(expr: "request.time")
}

type Endorsement @table {
  id: UUID! @default(expr: "uuidV4()")
  recipient: User!
  authorUid: String!
  episode: String!
  tags: [String!]!
  approved: Boolean! @default(value: false)
  createdAt: Timestamp! @default(expr: "request.time")
}

# ... Skill, Hobby, Qualification, Follow など必要に応じて
```

クエリ・ミューテーションは `dataconnect/connector/queries.gql` / `mutations.gql` に書き、

```bash
npx firebase dataconnect:sdk:generate
```

で `src/dataconnect-generated/` 以下に型付き SDK が生成される（このパスは `connector.yaml` で変えられる）。

## 4. Storage Security Rules

`storage.rules` をプロジェクトの方針に合わせて編集する。Profme の例:

```ruby
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ユーザのアバター: 本人のみ書き込み可、誰でも読み取り可（公開プロフィール）
    match /users/{uid}/avatar/{fileName} {
      allow read: if true;
      allow write:
        if request.auth != null
        && request.auth.uid == uid
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    // それ以外は明示的に拒否
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

ポイント:

- `users/{uid}/avatar/...` のように **uid をパスに含めて本人だけが書き込めるルール**にする
- ファイルサイズ制限と content-type の正規表現で大量・不正アップロードを弾く
- 公開する必要がないものは `allow read: if false;` をデフォルトに

## 5. Next.js 側の依存追加

```bash
npm i firebase firebase-admin
```

- `firebase` … クライアント SDK（電話番号認証 / reCAPTCHA / ID Token 取得 / Storage アップロード）
- `firebase-admin` … サーバ SDK（ID Token 検証 / セッション Cookie 発行 / Admin 権限での Storage 操作）

VS Code で開発するなら **Firebase Data Connect 拡張機能** も入れておくとスキーマ補完・GraphQL の検証が便利。

## 6. 環境変数 `.env.local`

```
# クライアント公開（NEXT_PUBLIC_ 接頭辞）
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=profme-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=profme-xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=profme-xxxxx.appspot.com

# ローカルエミュレータを使う合図（true なら接続を切り替える）
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true

# サーバ専用（Admin SDK 用）
# サービスアカウント JSON を 1 行で入れるか、GOOGLE_APPLICATION_CREDENTIALS のパスを使う
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Admin SDK がエミュレータと話すための環境変数（ローカル時のみ）
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
```

`.env.local` は `.gitignore` 済み（コミットしない）。`.env.example` にキー名だけ控えておく。

## 7. Firebase 初期化モジュール

### 7-1. クライアント

`src/lib/firebase/client.ts`

```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
  typeof window !== "undefined"
) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
```

### 7-2. サーバ (Admin)

`src/lib/firebase/admin.ts`

```ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

export const adminAuth = getAuth(app);
export const adminStorage = getStorage(app);
```

`FIREBASE_AUTH_EMULATOR_HOST` / `FIREBASE_STORAGE_EMULATOR_HOST` が設定されていれば `firebase-admin` は自動でエミュレータに繋がる（自分で接続コードは書かなくて OK）。

## 8. 電話番号認証フローの実装

### 8-1. ログイン画面（クライアント）

ポイント:

- `RecaptchaVerifier` をマウント時に 1 度だけ生成する
- 電話番号は **E.164 形式** (`+819012345678`) で渡す
- 第 2 ステップ（コード入力）に遷移するため `confirmationResult` を state に持つ

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export const PhoneLogin = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!recaptchaRef.current || verifierRef.current) return;
    verifierRef.current = new RecaptchaVerifier(auth, recaptchaRef.current, {
      size: "invisible",
    });
  }, []);

  const sendSms = async () => {
    if (!verifierRef.current) return;
    const result = await signInWithPhoneNumber(auth, phone, verifierRef.current);
    setConfirmation(result);
  };

  const verifyCode = async () => {
    if (!confirmation) return;
    const credential = await confirmation.confirm(code);
    const idToken = await credential.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    // → ログイン後の遷移
  };

  return (
    <>
      {!confirmation ? (
        <>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+819012345678" />
          <button onClick={sendSms}>SMS を送信</button>
          <div ref={recaptchaRef} />
        </>
      ) : (
        <>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="認証コード" />
          <button onClick={verifyCode}>確認</button>
        </>
      )}
    </>
  );
};
```

### 8-2. セッション Cookie 発行 API

`src/app/api/auth/session/route.ts`

```ts
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const SESSION_DURATION_MS = 60 * 60 * 24 * 14 * 1000; // 14 日

export async function POST(req: Request) {
  const { idToken } = await req.json();
  await adminAuth.verifyIdToken(idToken);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("__session");
  return res;
}
```

`runtime = "nodejs"` を必ず指定（`firebase-admin` は Edge Runtime で動かない）。

### 8-3. サーバ側の認証ヘルパ

`src/lib/auth/server.ts`

```ts
import { cookies } from "next/headers";
import { cache } from "react";
import { adminAuth } from "@/lib/firebase/admin";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return { uid: decoded.uid, phoneNumber: decoded.phone_number };
  } catch {
    return null;
  }
});
```

`React.cache` で同一リクエスト内の重複検証を防ぐ。

これで Server Component / API Route のどちらからでも `await getCurrentUser()` で同じ認証状態を取れる:

```tsx
// Server Component
const user = await getCurrentUser();
if (!user) redirect("/login");
```

```ts
// API Route
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // ...
}
```

### 8-4. Middleware（ガードのみ）

`src/middleware.ts` で未ログインを早めに弾くと UX が良い。Cookie の **存在チェックだけ**にとどめる（Edge Runtime では `firebase-admin` が動かないため検証は RSC / API 側）。

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const session = req.cookies.get("__session");
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/profile/edit"],
};
```

## 9. Data Connect の利用

- サーバ側からは Admin 権限で SDK を呼び、ユーザ uid を引数に渡してデータ操作（行レベルの認可は Data Connect の `@auth(level: USER)` ディレクティブで宣言する）
- クライアント側からの直接呼び出しが必要なら、Firebase Auth の現在のユーザコンテキストで自動的に `auth.uid` がクエリに反映される
- 初期データやマイグレーションは Data Connect エミュレータの永続化ディレクトリ (`./.dataconnect-emulator`) に保存される

## 10. Storage の利用

### 10-1. クライアントから直接アップロード

アバター画像のアップロード例（プロフィール編集画面）:

```tsx
"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/client";

const uploadAvatar = async (file: File) => {
  const user = auth.currentUser;
  if (!user) throw new Error("not authenticated");
  const objectRef = ref(storage, `users/${user.uid}/avatar/${file.name}`);
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
};
```

- 取得した `downloadURL` を Data Connect の `User.avatarUrl` に保存
- クライアントから直接書き込むので Next.js のサーバを介さず軽量
- 認可は Storage Rules（uid 一致 + サイズ + content-type）で守る

### 10-2. サーバ側で扱う場合

サーバ生成画像（QR の PNG ダウンロード等）や、信頼できないユーザ入力を経由するケースは Admin SDK で:

```ts
import { adminStorage } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const buffer = await generateQrPng(`https://profme.app/card/${user.uid}`);
  const file = adminStorage.bucket().file(`users/${user.uid}/qr/card.png`);
  await file.save(buffer, { contentType: "image/png" });
  const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 3600_000 });
  return NextResponse.json({ url });
}
```

- `bucket()` 引数を省略すると `initializeApp({ storageBucket: ... })` で渡したバケットが既定になる
- 一時公開なら `getSignedUrl`、永続公開ならバケットを公開設定にして `https://storage.googleapis.com/...` を直接返す

### 10-3. 画像表示

- Next.js の `<Image>` で読むなら `next.config.ts` の `images.remotePatterns` に Storage ドメインを追加:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    { protocol: "http",  hostname: "127.0.0.1" }, // emulator
  ],
}
```

## 11. 開発時の起動

ターミナル 2 枚で並走させる。

```bash
# Terminal A — Firebase Emulator Suite
npx firebase emulators:start
# → Emulator UI: http://127.0.0.1:4000
#   Auth: 9099 / Data Connect: 9399 / Storage: 9199

# Terminal B — Next.js
npm run dev
```

`concurrently` を入れて npm script でまとめても OK。

```json
"scripts": {
  "dev": "next dev",
  "dev:emu": "firebase emulators:start",
  "dev:all": "concurrently -n web,emu \"npm:dev\" \"npm:dev:emu\""
}
```

## 12. 動作確認

1. `http://127.0.0.1:4000` (Emulator UI) で `Authentication > Add user` から、テスト用電話番号を作成（または `firebase.json` のテスト番号を活用）
2. `/login` にアクセスし、登録した番号で SMS 送信 → Emulator UI の Auth タブに送られたコードが表示される
3. コードを入力 → セッション Cookie `__session` がブラウザに設定されるのを DevTools で確認
4. `/dashboard` 等の保護ページでサーバ側 `getCurrentUser()` が `uid` と `phoneNumber` を返すこと
5. API Route から Data Connect エミュレータに対するクエリが通ること
6. プロフィール編集でアバターをアップロード → Emulator UI の Storage タブで `users/<uid>/avatar/...` が作成され、別 uid からの書き込みが Rules で拒否されること

## 13. 押さえておくポイント / トレードオフ

- **電話番号は E.164 必須**: `+81` から始める。日本国内の電話番号は最初の `0` を抜く（`090-1234-5678` → `+819012345678`）。
- **reCAPTCHA**: invisible reCAPTCHA で UX を損ねずに済む。`localhost` でも動く。本番は承認済みドメインに追加する。
- **テスト用電話番号**: 本番アカウントを消費せず、SMS が実際に飛ばないので CI / 自動テストにも使える。
- **Edge vs Node Runtime**: `firebase-admin` を呼ぶ箇所は `export const runtime = "nodejs";` を必ず指定。
- **Cookie vs Authorization ヘッダ**: SSR が前提なら Cookie 方式が圧倒的に楽。SPA + 別 API なら Bearer の方が向く。
- **セッションの寿命**: `createSessionCookie` の `expiresIn` は最大 14 日。延長したい場合は再ログインさせる。
- **Data Connect のスキーマ変更**: emulator 上ではマイグレーションが自動生成されるが、本番反映時に Cloud SQL に対する DDL が走るので破壊的変更には注意。
- **Storage はクライアント直アップロード優先**: API 経由するとサーバが大量のバイナリを中継してメモリ／タイムアウト的に苦しい。Rules で本人パスに絞る方が安全かつ速い。
- **Storage の URL**: `getDownloadURL` で得る URL にはトークンが含まれていて誰でも閲覧できる。非公開にしたい画像は `getSignedUrl` で短命の URL を都度発行する設計にする。
- **画像最適化**: `next/image` で Storage の URL を読む場合は `images.remotePatterns` に Firebase Storage ドメインを追加する（Emulator 用に `127.0.0.1` も）。
- **CSRF 対策**: `__session` を SameSite=Lax にしているので基本的な CSRF は防げる。状態を変更する API では追加で CSRF token を検討。

## 14. 次にやること

実装着手の順序例:

1. `firebase init` を実行して `firebase.json` / `dataconnect/` / `storage.rules` / `.firebaserc` を生成
2. `npm i firebase firebase-admin` で依存を追加
3. `src/lib/firebase/{client,admin}.ts` を作成（Auth + Storage）
4. `src/app/api/auth/session/route.ts` の雛形作成
5. `src/lib/auth/server.ts` の `getCurrentUser` 実装
6. ログイン画面を作って実際に Auth Emulator で疎通確認
7. アバターアップロードを Storage Emulator に対して動作確認
8. Data Connect スキーマを定義 → SDK 生成 → Server Component から疎通

ここまで通れば、認証 + DB + ストレージの土台は完成です。
