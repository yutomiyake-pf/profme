# Firebase Data Connect

## 構成

```
dataconnect/
├── schema/                 # @table 定義 (DB スキーマ)
│   ├── user.gql
│   ├── custom_link.gql
│   ├── follow.gql
│   └── endorsement.gql
└── profme/                 # connector 配下: query / mutation
    ├── connector.yaml
    ├── user.gql
    ├── custom_link.gql
    ├── follow.gql
    └── endorsement.gql

src/dataconnect-generated/  # `firebase dataconnect:sdk:generate` の出力 (手で触らない)
```

GraphQL ファイル変更後は必ず `npm run dataconnect:generate` を実行 (postinstall でも自動実行される)。

## サーバから DataConnect を呼ぶ

サーバ (RSC / API Route) からの DataConnect アクセスは **`firebase-admin/data-connect` の `dataConnectAdmin` に統一**している (`src/lib/firebase/admin.ts`)。クライアント側からは API Route 経由でしか叩かない。

### 罠 1: executeQuery / executeMutation の引数

型上は `(name, options)` のオーバーロードもあるが、**runtime は常に `(name, variables, options)` の 3 引数で動く**。variables を省くと options が variables 扱いされて `$impersonate is not expected` 等のエラーになる。

```ts
// ❌ NG (runtime で options が variables 扱い)
dataConnectAdmin.executeQuery<GetMyProfileData>("GetMyProfile", { impersonate: ... });

// ✅ OK (variables に undefined を明示)
dataConnectAdmin.executeQuery<GetMyProfileData, undefined>(
  "GetMyProfile",
  undefined,
  { impersonate: { authClaims: { sub: user.uid } } },
);
```

### 罠 2: @auth(level: USER) を呼ぶときは impersonate.authClaims が必須

admin SDK は default で `@auth` をバイパスするが、`auth.uid` を CEL で参照する operation (`uid_expr: "auth.uid"`、`@auth(level: USER)` 等) を呼ぶには `impersonate.authClaims.sub` で session の uid を注入する必要がある。

```ts
const impersonate = { impersonate: { authClaims: { sub: user.uid } } } as const;

await dataConnectAdmin.executeMutation<UpdateMyProfileData, UpdateMyProfileVariables>(
  "UpdateMyProfile",
  vars,
  impersonate,
);
```

`auth.uid_expr: "auth.uid"` を使った operation で impersonate が無いと CEL 解決失敗してエラーになる。

### 罠 3: クライアント SDK は server で使わない

`firebase/data-connect` (client SDK) を server で使うと、Firebase Auth singleton 状態が並列リクエスト間で漏れる。完全に admin SDK 一本化している。クライアントから直接 GraphQL を叩く経路は閉じている。

## @auth レベル運用

| level | 用途 |
|---|---|
| `PUBLIC` | 公開閲覧用 (例: `GetProfile`、`GetEndorsementsByRecipient`)。PII を含めない |
| `USER` | 認証済ユーザのコンテキストで実行 (admin SDK + impersonate で呼ぶ) |
| `NO_ACCESS` | クライアントから直接叩けない server 専用 (例: `GetUserByPhone`、`CreateUser`) |

クライアント SDK 経由のアクセスを撤廃済なので、本来 PUBLIC にする必要が無い operation は `NO_ACCESS` に絞る。

## CEL でよく使う組み合わせ

```graphql
# 自分の行を引く
user(key: { uid_expr: "auth.uid" }) { ... }

# 自分の行に挿入
user_insert(data: { uid_expr: "auth.uid", ... })

# updatedAt 自動更新
user_update(key: { ... }, data: { ..., updatedAt_expr: "request.time" })

# 双方向の Follow を 1 query で取得
query GetFollowRelationship($other: String!) @auth(level: USER) {
  outgoing: follow(key: { followerUid_expr: "auth.uid", followeeUid: $other }) { status }
  incoming: follow(key: { followerUid: $other, followeeUid_expr: "auth.uid" }) { status }
}
```

## upsert vs insert

`xxx_insert` は composite key 重複で error、`xxx_upsert` は同 key の場合 update。同時 POST race を許容したい場合は upsert が安全 (例: `CreateFollowRequest`)。

ただし upsert は同 key の既存値を **指定したフィールドだけ** 上書きするので、`status` が approved の行に pending を upsert すると downgrade することがある。upsert を使う場合は API Route 側で current state チェックを併用すること。

## emulator 接続

`firebase-admin/data-connect` は `process.env.DATA_CONNECT_EMULATOR_HOST` を見て自動で emulator に切り替わる (config 不要)。本番デプロイ時はこの env を設定しないこと (うっかり設定すると prod が `127.0.0.1:9399` を叩きにいって死ぬ)。

## DB を直接覗きたい場合

```bash
npm run dataconnect:psql
```

PGlite emulator (port 5433) に接続する。詳細 → `docs/firebase_sql_connect.md`
