# Profme Frontend — Agent Guide

Claude が本プロジェクトで作業するうえで最低限知っておくべき内容のみを書いている。
詳細トピックは `docs/` 配下を参照。

## Stack (バージョン固定 — training data と異なる可能性あり)

| 項目 | 値 | メモ |
|---|---|---|
| Next.js | 16.2 (App Router) | `params` は `Promise`、`cookies()` は async |
| React | 19.2 | `FormEvent` 非推奨、controlled input のチェックが厳格 |
| zod | 4.x | `z.url()` `z.enum(...)` がトップレベル関数 |
| react-hook-form | 7.74 | subscription に罠あり → `docs/forms.md` |
| firebase-admin | 13.8 | data-connect の executeQuery 引数に罠 → `docs/dataconnect.md` |
| firebase | 12.x (client SDK) | `dataConnect` は server から admin SDK 経由に統一 |

> Next.js の API を書く前に `node_modules/next/dist/docs/` 該当ガイドを必ず読むこと。

## 強制ルール (作業前に必ず確認)

1. **RHF subscription**: `useFormContext` から `formState.errors` を destructure すると subscription が効かない。`useFormState({ control })` を使う。`watch()` も同様に `useWatch({ control, name })` を使う。詳細 → `docs/forms.md`
2. **DataConnect admin SDK の executeQuery/Mutation**: 型上 `(name, options)` も許すが runtime は常に `(name, variables, options)` の 3 引数。variables が無くても `undefined` を明示する。詳細 → `docs/dataconnect.md`
3. **server fetcher の cookie 転送**: `serverFetcher` は `next/headers` の `cookies()` を読んで `Cookie` ヘッダを付け直して自分自身の API Route を叩く。`fetch` 直接使うとセッションが伝わらない。
4. **API Route 統一**: 動的 segment も含め全ルートを `createRoute(...mws, handler)` で書く。直接 `export async function GET()` を生で書かない。
5. **コメントは最小限**: 命名から読める処理は書かない。書くのは「なぜそう書いたか」が非自明な時のみ (1 行以内)。詳細 → `docs/conventions.md`
6. **`<Link><Button>` 禁止**: `<a><button>` は不正 HTML。`LinkButton` を使う。

## ディレクトリ構成 (要点)

```
src/
├── app/
│   ├── (site)/              # ユーザ向けページ群
│   │   └── <feature>/
│   │       ├── _containers/ # PageContainer (server) / xxxContainer (client)
│   │       ├── _components/ # 純粋表示
│   │       └── page.tsx
│   ├── _components/         # アプリ共通 UI
│   ├── _providers/          # AuthProvider 等
│   └── api/                 # Route Handlers (createRoute / withSession / withZod)
├── constants/               # ドメイン定数 (avatar / endorsement / cardTheme 等)
├── dataconnect-generated/   # GraphQL から生成 (手書き不可)
├── lib/
│   ├── auth/                # session helper (getCurrentUser)
│   ├── fetcher/             # clientFetcher / serverFetcher
│   ├── firebase/            # admin (server-only) / client
│   └── next/                # composePage / withSession / withZodSearchParams
└── ...

dataconnect/
├── schema/      # @table 定義
└── profme/      # query / mutation
```

詳細 (Container/Component / ミドルウェア合成) → `docs/architecture.md`

## 開発フロー

- `npm run dev` — dev server
- `npm run typecheck` — 必ず通す (PR 前必須)
- `npm run lint` — eslint-config-next + react-hooks/refs などのチェック
- `npm run dataconnect:generate` — GraphQL 変更後に SDK 再生成 (`postinstall` でも自動実行)
- `npm run emulators:start` / `:stop` — Firebase emulator suite

## 関連ドキュメント

- [`docs/architecture.md`](docs/architecture.md) — Container/Component 構成、ミドルウェア合成
- [`docs/forms.md`](docs/forms.md) — react-hook-form + zod の罠と回避法
- [`docs/dataconnect.md`](docs/dataconnect.md) — GraphQL 運用、admin SDK の罠
- [`docs/conventions.md`](docs/conventions.md) — 命名・スタイル・コメント方針
- [`docs/firebase_sql_connect.md`](docs/firebase_sql_connect.md) — PGlite に直接 psql するメモ
