# Profme — Frontend

大学生向けデジタル名刺サービス。Next.js (App Router) + Firebase Auth (電話番号認証) + Firebase Data Connect (Cloud SQL) + Firebase Storage で構築。

## 必要環境

| ツール       | バージョン | 用途                                           |
| ------------ | ---------- | ---------------------------------------------- |
| Node.js      | `22.19.0`  | `package.json#engines` で固定                  |
| npm          | `>=10`     | パッケージマネージャ                           |
| Java         | 11 以上    | Firebase Auth / Storage Emulator (JVM ベース)  |
| psql         | 任意       | Data Connect の中身 (PGlite) を確認したい時    |
| Firebase CLI | 自動       | `firebase-tools` は devDependencies に含まれる |

### macOS でのインストール例

```bash
# Java (Eclipse Temurin)
brew install --cask temurin

# psql (任意)
brew install postgresql@16
```

## 初回セットアップ

### 1. 依存パッケージのインストール

```bash
cd frontend
npm install
```

`postinstall` フックで `firebase dataconnect:sdk:generate` が自動実行され、`src/dataconnect-generated/` に型付き SDK が生成されます。

### 2. 環境変数 `.env.local` を作成

リポジトリ管理者から `.env.local` の中身を共有してもらってください。最低限以下が必要です：

```bash
# クライアント公開
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=p...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# emulator 接続フラグ (ローカル開発のみ true)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true

# サーバ専用 (Admin SDK)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# emulator のホスト指定 (ローカル開発のみ)
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
```

### 3. Firebase ログイン (初回のみ)

Emulator は単独で動きますが、SDK 生成や本番アクセスには Firebase CLI のログインが必要です。

```bash
npx firebase login
```

## 開発サーバの起動

ターミナルを 2 つ開いて並走させます。

**Terminal A — Firebase Emulator**

```bash
npm run emulators:start
```

起動後、`http://127.0.0.1:4000` で Emulator UI が開けます。

| サービス                       | ポート |
| ------------------------------ | ------ |
| Auth                           | 9099   |
| Storage                        | 9199   |
| Data Connect (API)             | 9399   |
| Data Connect (PGlite Postgres) | 5433   |
| Emulator UI                    | 4000   |

**Terminal B — Next.js**

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが開きます。

## テストデータの投入 (任意)

ダッシュボードのページネーション・評価承認・フォロワー機能を実データで確認したい場合、シードを実行できます (emulator 起動中に別ターミナルで)。

```bash
npm run seed
```

実行内容 (Firebase Auth と Postgres を `TRUNCATE` で完全クリアしてから書き込むので何度走らせても冪等):

| 内容                                 | 件数 | 補足                                  |
| ------------------------------------ | ---- | ------------------------------------- |
| メインユーザ (Auth + DB)             | 1    | uid `Sd9oW2xMzC4hY7BfRk1VqJpL5tZc`    |
| フィラーユーザ (DB のみ)             | 100  | follower / endorsement author 用      |
| フォロー申請 (pending)               | 25   | Dashboard ページネーション 2 ページ分 |
| フォロワー (approved)                | 25   | 同上                                  |
| 評価の承認待ち (pending endorsement) | 25   | 同上                                  |
| 公開済み評価 (approved endorsement)  | 10   | カードページの 2 ページ分 (5/page)    |

メインユーザの電話番号 `+81 90 9876 5432` でログインすると、ダッシュボード各タブで 2 ページ分のデータが確認できます。

> **安全装置**: `NODE_ENV=development` かつ `FIREBASE_AUTH_EMULATOR_HOST` が localhost を向いている場合のみ実行可能。本番には絶対に向きません。

## 認証フローの動作確認

電話番号認証は Emulator では SMS が飛ばないので、認証コードを別経路で取得します。

1. `/login` で電話番号を入力（例: `09012345678`）→「次へ」
2. 別タブで認証コードを確認:
   ```
   http://127.0.0.1:9099/emulator/v1/projects/profme-dev/verificationCodes
   ```
   または:
   ```bash
   curl -s http://127.0.0.1:9099/emulator/v1/projects/profme-dev/verificationCodes \
     | jq -r '.verificationCodes[-1] | "\(.phoneNumber) → \(.code)"'
   ```
3. 表示された 6 桁コードをログイン画面に入力
4. 新規番号なら「お名前」入力 → 既存ならそのまま `/dashboard` へ遷移

## 主な npm scripts

| コマンド                       | 用途                                                           |
| ------------------------------ | -------------------------------------------------------------- |
| `npm run dev`                  | Next.js 開発サーバ起動                                         |
| `npm run build`                | 本番ビルド                                                     |
| `npm run start`                | ビルド済みアプリを起動                                         |
| `npm run lint`                 | ESLint                                                         |
| `npm run lint:fix`             | ESLint 自動修正                                                |
| `npm run typecheck`            | `tsc --noEmit`                                                 |
| `npm run format`               | Prettier 適用                                                  |
| `npm run format:check`         | Prettier チェックのみ                                          |
| `npm run emulators:start`      | Firebase Emulator (Auth/Storage/DataConnect) 起動              |
| `npm run emulators:stop`       | Emulator プロセスを kill                                       |
| `npm run seed`                 | テストデータ投入 (Auth / DB を全クリアしてから書き込む)        |
| `npm run dataconnect:generate` | Data Connect の TS SDK を再生成 (`src/dataconnect-generated/`) |
| `npm run dataconnect:psql`     | Data Connect Emulator の PGlite に psql 接続                   |

## DB を覗く

emulator 起動中：

```bash
# テーブル一覧
npm run dataconnect:psql -- -c '\dt'

# ユーザ一覧
npm run dataconnect:psql -- -c 'SELECT * FROM "user"'

# インタラクティブモード
npm run dataconnect:psql
```

> `user` は SQL 予約語のためダブルクォート必須。`endorsement` 等は不要。

## DB をリセットしたい場合

PGlite のデータは `dataconnect/.dataconnect/pgliteData/` に永続化されています。再起動しても消えません。完全に空の状態に戻すには：

```bash
npm run emulators:stop
rm -rf dataconnect/.dataconnect/pgliteData
npm run emulators:start
```

## ディレクトリ構成 (主要)

```
frontend/
├── dataconnect/                # Data Connect スキーマ・コネクタ定義
│   ├── schema/                 # テーブル定義 (user.gql / follow.gql / ...)
│   └── profme/                 # Connector (queries.gql / mutations.gql)
├── docs/                       # 設計ドキュメント
├── src/
│   ├── app/
│   │   ├── (site)/             # サイト全体 (Header/Footer 付き)
│   │   ├── api/                # Next.js API Routes
│   │   ├── _components/        # 共通 UI コンポーネント
│   │   └── _providers/         # Context (AuthProvider など)
│   ├── constants/              # 定数 (cardTheme, site)
│   ├── dataconnect-generated/  # 自動生成 SDK (一部だけコミット)
│   └── lib/                    # 共通ロジック (firebase / fetcher / auth)
├── firebase.json               # Emulator/サービス設定
├── storage.rules               # Cloud Storage Rules
└── package.json
```

## トラブルシューティング

### `Port 9399 is not open ...` で emulator 起動失敗

前回の dataconnect-emulator プロセスが残っている可能性。

```bash
npm run emulators:stop      # 強制 kill
lsof -iTCP:9399 -sTCP:LISTEN -nP   # 残骸確認
npm run emulators:start
```

### `Java Runtime not found`

Auth / Storage Emulator は JDK 11+ が必要です。`brew install --cask temurin` でインストール後、`java -version` で確認してから再起動。

### `npm install` で `@dataconnect/generated` の解決に失敗

`firebase` CLI が見つからずに postinstall が失敗している可能性があります。`npx firebase --version` を確認、必要なら `npm install` を再実行してください。

## さらに詳しい設計資料

- [`docs/firebase_sql_connect.md`](./docs/firebase_sql_connect.md) — Data Connect の概要
