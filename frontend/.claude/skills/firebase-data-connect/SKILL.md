---
name: firebase-data-connect
description: Firebase Data Connect (Cloud SQL for PostgreSQL を GraphQL でラップしたサービス) の基礎。Profme では User / Endorsement / Follow などのリレーショナルデータを扱う。
---

# Firebase Data Connect

Cloud SQL for PostgreSQL を Firebase 流に「スキーマ + 事前定義クエリ + 自動生成 SDK」で扱える GA プロダクト。Firestore とは別物で、Profme では **リレーショナル要件 (Endorsement / Follow / Tag) のため Data Connect を採用** する。

## 概念モデル

- **Service** … 1 プロジェクトにつき 1 つ。GraphQL API のトップ単位
- **Schema** … `dataconnect/schema/*.gql` に定義。`@table` 付きの GraphQL 型 → 自動で Postgres DDL が生成される
- **Connector** … `dataconnect/connector/*.gql` に書く事前定義クエリ・ミューテーション。クライアントから ad-hoc クエリは投げず、ここに登録した操作だけを叩ける（API 表面の固定）
- **Generated SDK** … スキーマと Connector から型付き SDK が生成される (`firebase dataconnect:sdk:generate`)

## スキーマ例 (Profme)

```graphql
type User @table {
  id: String! @col(name: "uid")
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

type Follow @table @index(fields: ["follower", "followee"], unique: true) {
  id: UUID! @default(expr: "uuidV4()")
  follower: User!
  followee: User!
  status: String! # "pending" | "approved"
  createdAt: Timestamp! @default(expr: "request.time")
}
```

ポイント:

- `@table` を付けた型がそのまま Postgres テーブルになる
- `@col(name: "uid")` で列名を指定（命名規則を SQL 側に合わせたいとき）
- `@index` で複合インデックスを宣言
- `@default(expr: ...)` で `gen_random_uuid()` / `now()` 相当を表現

## 認可 — `@auth` ディレクティブ

クエリ・ミューテーション単位で認可レベルを宣言する:

```graphql
mutation upsertMyProfile($input: UserInput!) @auth(level: USER) {
  user_upsert(data: $input) {
    id
  }
}

query myEndorsements @auth(level: USER) {
  endorsements(where: { recipientUid: { _eq: "auth.uid" } }) {
    id
    episode
    tags
  }
}
```

- `PUBLIC` … 認証不要
- `USER` … サインイン済み
- `USER_EMAIL_VERIFIED` … 確認済みメール
- `NO_ACCESS` … クライアントから到達不可（サーバ専用）

`auth.uid` は Firebase Auth と統合され、自動で参照可能。

## SDK 生成と利用

```bash
npx firebase dataconnect:sdk:generate
```

生成された SDK をクライアント／サーバから呼ぶ:

```ts
import { upsertMyProfile, myEndorsements } from "@/dataconnect-generated";

await upsertMyProfile({ input: { displayName: "山田 太郎", ... } });
const { data } = await myEndorsements();
```

クライアントから呼ぶ場合は Firebase Auth でサインイン済みであれば、トークンが自動付与される。

## エミュレータ

- ローカル Postgres を立ち上げ、`request.auth` をエミュレートできる
- `dataconnect:execute` でスキーマ変更を試行 → 自動マイグレーション
- 永続化ディレクトリ (`./.dataconnect-emulator`) にデータが保存されるので再起動しても消えない

## マイグレーション運用の注意

- Emulator では破壊的変更も自動適用される。本番反映時 (`firebase deploy --only dataconnect`) は **既存データに対する DDL** が走るので、列削除・型変更は要レビュー
- 列追加は安全。削除はデプロイブロッカーになりがち
- 大規模変更は Cloud SQL 側で手動マイグレーションを用意して `dataconnect.yaml` に記述する

## VS Code 拡張

- "Firebase Data Connect" 拡張を入れると `*.gql` の補完・スキーマ検証・クエリ実行プレビューが動く
- Cursor / Continue でも同等の機能あり

## 参考リンク

- [Data Connect Quickstart](https://firebase.google.com/docs/data-connect/quickstart)
- [Data Connect Schema GraphQL Reference](https://firebase.google.com/docs/data-connect/schema-reference)
- [Authorization with @auth](https://firebase.google.com/docs/data-connect/authorization)
- プロジェクト内設計書: `frontend/docs/firebase_sql_connect.md` / `frontend/docs/local_setup.md`
