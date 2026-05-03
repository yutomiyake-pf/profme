---
name: firebase-auth-basics
description: Firebase Authentication の基礎。Profme は電話番号認証 + セッション Cookie 方式を採用する。
---

# Firebase Auth Basics

## Profme での採用方針

- **認証プロバイダ**: 電話番号認証（SMS 経由のワンタイムコード）
- **セッション保持**: ID Token をサーバで検証してセッション Cookie に焼き直す
- **適用範囲**: Server Components / API Route / Client の三者で同じ認証状態を読める

## 電話番号認証フロー

```
[Client]                                  [Firebase Auth]      [Next.js Server]
1. RecaptchaVerifier 初期化
2. signInWithPhoneNumber(phone, recap.) → SMS 発信
3. ユーザがコード入力
4. confirmationResult.confirm(code) ←──── 検証 OK / UserCredential
5. user.getIdToken()
6. POST /api/auth/session { idToken } ────→
                                          adminAuth.verifyIdToken
                                          adminAuth.createSessionCookie
7.                                ←──── Set-Cookie: __session HttpOnly
```

### クライアント側のポイント

- 電話番号は **E.164 形式** (`+819012345678`) で渡す
- `RecaptchaVerifier` はマウント時に 1 度だけ作る（再生成はエラーになる）
- invisible reCAPTCHA で UX を損なわず動かせる
- `confirmationResult` を state に持って 2 段階目（コード入力）に進む

```ts
const verifier = new RecaptchaVerifier(auth, container, { size: "invisible" });
const result = await signInWithPhoneNumber(auth, "+819012345678", verifier);
// → ユーザがコード入力
const credential = await result.confirm(code);
const idToken = await credential.user.getIdToken();
```

### サーバ側のポイント

- ID Token は短命（1 時間）。**セッション Cookie に焼き直す**ことで再認証を避ける
- `createSessionCookie` の `expiresIn` は最大 14 日
- Cookie は `HttpOnly; Secure (本番); SameSite=Lax` を必ず設定

```ts
const sessionCookie = await adminAuth.createSessionCookie(idToken, {
  expiresIn: 14 * 24 * 60 * 60 * 1000,
});
res.cookies.set("__session", sessionCookie, {
  httpOnly: true,
  secure: prod,
  sameSite: "lax",
  path: "/",
});
```

### 認証状態の取得（共通ヘルパ）

`React.cache` で同一リクエスト内のメモ化を効かせる:

```ts
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies(); // Next.js 16 は async
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

## エミュレータでの開発

- Auth Emulator はテスト用電話番号 + 固定コードを `firebase.json` か Emulator UI で設定可能
- `+81 90 0000 0000` / `123456` などを登録しておくと、本番 SMS を消費せず動作確認できる
- 実際に SMS は飛ばないが、Emulator UI > Authentication > 「Sign-in attempts」でコードを確認できる

## トラブルシューティング

- `auth/captcha-check-failed` … reCAPTCHA verifier が再利用されていないか確認。1 ページに 1 インスタンス
- `auth/invalid-phone-number` … E.164 形式になっているか
- `auth/quota-exceeded` … 1 番号あたりの SMS 送信に上限あり。テスト時はテスト用番号を使う
- `auth/argument-error` で session cookie 検証失敗 … 期限切れか、署名鍵のローテーション後にエミュレータと本番が混在しているケースが多い

## Middleware でのガード

`middleware.ts` は Edge Runtime なので Admin SDK が動かない。Cookie の **存在チェック** だけ行い、本物の検証は RSC / Route 側に任せる:

```ts
export const middleware = (req: NextRequest) => {
  if (!req.cookies.get("__session") && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
};
```

## 参考リンク

- [Phone Number Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [Manage Session Cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
- プロジェクト内設計書: `frontend/docs/local_setup.md`
