---
name: firebase-security-rules-auditor
description: Firebase Security Rules (Storage / Firestore / Data Connect) のレビューと監査。Profme では Cloud Storage Rules を主に扱う。
---

# Firebase Security Rules Auditor

Profme では **Cloud Storage Rules** が主戦場（Firestore は使わず Data Connect で代替、Data Connect の認可は `@auth` ディレクティブ側）。本スキルは Rules の書き方とよくある脆弱性をまとめる。

## 基本構造

```ruby
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ルールをここに書く
  }
}
```

`match /path/{var}` でパスをマッチ。`{var}` はキャプチャ（`uid` などの動的値）、`{var=**}` は再帰マッチ。

## 認可の判定材料

- `request.auth` … 認証済みなら non-null。`request.auth.uid` が UID
- `request.resource` … 書き込もうとしているリソース。`size` (バイト数) と `contentType` (MIME タイプ) が取れる
- `resource` … 既存リソース（読み取り・上書き時）
- `request.time` … サーバ時刻

## Profme の Storage Rules（推奨）

```ruby
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // アバター: 本人だけが書き込み、誰でも読める
    match /users/{uid}/avatar/{fileName} {
      allow read: if true;
      allow write:
        if request.auth != null
        && request.auth.uid == uid
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    // 名刺 QR の自動生成（サーバが Admin SDK で書き込み、クライアントは読むだけ）
    match /users/{uid}/qr/{fileName} {
      allow read: if true;
      allow write: if false;        // Admin SDK 経由のみ
    }

    // 既定で拒否
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## チェックリスト

書く／レビューする際に必ず確認する:

- [ ] **既定 deny** が末尾にあるか (`/{allPaths=**} { allow read, write: if false; }`)
- [ ] `request.auth != null` を必須条件に入れているか
- [ ] パスの `{uid}` が `request.auth.uid` と一致するか確認しているか
- [ ] `request.resource.size` で **アップロードサイズ上限** を設定しているか
- [ ] `request.resource.contentType.matches('image/.*')` 等で **MIME タイプ** を絞っているか
- [ ] 既存ファイルの上書きを許可するなら `resource` 側でも所有者チェックを行っているか
- [ ] 公開してよいパスと非公開パスが混在していないか
- [ ] `match /{allPaths=**}` 配下に意図しない `allow` がないか

## よくあるアンチパターン

### ❌ 認証だけで書き込みを許す

```ruby
match /users/{uid}/avatar/{file} {
  allow write: if request.auth != null;   // 他人のディレクトリにも書き放題
}
```

→ `request.auth.uid == uid` を必ず付ける。

### ❌ `match /{allPaths=**} { allow read, write: if true; }`

開発初期によくある。本番反映前に **絶対に** 直す。

### ❌ サイズ制限なし

```ruby
allow write: if request.auth.uid == uid;
```

→ 数 GB のファイルが上がってコスト爆発するリスク。`request.resource.size` を必ず入れる。

### ❌ Content-Type 未検証

→ `image/png` を期待しているのに `application/x-msdownload` が上がる、など。`matches('image/.*')` で絞る。

### ❌ 上書き時のチェック漏れ

```ruby
allow write: if request.auth.uid == uid;       // 新規はOK
```

`write` は create + update + delete を含むので、既存ファイルが他人の所有でも上書きされうる。`resource.metadata.uploaderUid == request.auth.uid` のような条件で守る。

## エミュレータでのテスト

```bash
firebase emulators:start
```

Emulator UI > Storage で実際にアップロードを試して Rules の挙動を確認。`firebase emulators:exec --only storage 'npm test'` で CI に組み込める。

ユニットテスト用に `@firebase/rules-unit-testing` パッケージが使える:

```ts
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";

const testEnv = await initializeTestEnvironment({ projectId: "demo-profme", storage: { rules: readFileSync("storage.rules", "utf8") } });
await assertSucceeds(uploadAvatar(testEnv.authenticatedContext("user-1"), "users/user-1/avatar/me.png"));
await assertFails(uploadAvatar(testEnv.authenticatedContext("user-2"), "users/user-1/avatar/evil.png"));
```

## デプロイ

```bash
firebase deploy --only storage
```

Rules はバージョン管理されるので、Console から差し戻しも可能。

## 参考リンク

- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Rules Language Reference](https://firebase.google.com/docs/rules/rules-language)
- [Rules Unit Testing](https://firebase.google.com/docs/rules/unit-tests)
- プロジェクト内設計書: `frontend/docs/local_setup.md` (§4 Storage Security Rules)
