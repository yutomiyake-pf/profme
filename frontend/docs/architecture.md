# Architecture

## Container / Component / Page の役割

| 役割 | 場所 | クライアント/サーバ | 責務 |
|---|---|---|---|
| `page.tsx` | `app/<feature>/page.tsx` | server | ルーティング + ミドルウェア合成 + Container 起動 |
| `PageContainer` | `_containers/PageContainer/` | server | API/DataConnect から初期データ取得 → 必要な形に transform → render-prop で Component に渡す |
| 機能別 `xxxContainer` | `_containers/xxx/` | client (`"use client"`) | 副作用 (POST/PUT、ファイル upload、router.refresh) を提供する render-prop |
| Component | `_components/` | server / client | 純粋表示。API レスポンス型に依存させない |

### render-prop パターン

Container は children に関数を渡す:

```tsx
export const FollowContainer = ({ userId, children }: Props) => {
  const submit = async () => { ... };
  return <>{children({ isSubmitting, submit })}</>;
};

// 使い方
<FollowContainer userId={profile.uid}>
  {({ isSubmitting, submit }) => <Button onClick={submit} isLoading={isSubmitting}>...</Button>}
</FollowContainer>
```

server-only Container (PageContainer) でも render-prop OK。子も server component なら境界を跨がない。

### API レスポンス型をコンポーネントに漏らさない

PageContainer は `getUserResponseSchema` 経由で API から受けた値を、Component が要求する自前の domain 型 (例: `CardProfile`) に詰め替えてから渡す。Component は API 型を import しない。

## API Route のミドルウェア合成

`src/app/api/utils/` の `createRoute` で flat に合成:

```ts
export const POST = createRoute(
  withSession(),
  withZod({ body: schema }),
  async ({ user, body }) => NextResponse.json({ ok: true }),
);
```

- 左から右へ順に走る (一番左が外側)
- 各ミドルウェアが ctx に値を追加し、ハンドラは合算 ctx を受ける
- 動的 segment (`[userId]`) を扱う場合も `createRoute` を closure 内で呼ぶ:

```ts
export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return createRoute(
    withSession(),
    async ({ user }) => { ... userId はクロージャでアクセス ... },
  )(request);
}
```

## Page のミドルウェア合成

`src/lib/next/` の `composePage`:

```ts
export default async function Page(props: Props) {
  return composePage(
    withSession({ requireAuth: true }),
    withZodSearchParams(searchParamsSchema),
    async ({ parsedSearchParams }) => <Dashboard ... />,
  )(props);
}
```

API Route と同じ flat 合成。

## fetcher

`src/lib/fetcher/`:

- `clientFetcher(endpoint, { schema, method, body, ... })` — ブラウザから API Route を叩く
- `serverFetcher(endpoint, { schema, ... })` — server (RSC / Server Action) から自分自身の API Route を叩く。`next/headers` の `cookies()` を自動で `Cookie` ヘッダに転送するため withSession() が通る

両方 zod schema でレスポンスを検証。`throwErr: false` で null フォールバック。

## ディレクトリ深掘り

```
src/app/(site)/<feature>/
├── page.tsx
├── _containers/
│   ├── PageContainer/index.tsx          server: 初期データ
│   ├── XxxContainer/index.tsx           client: 副作用 (POST 等)
│   └── ...
└── _components/
    ├── XxxView/index.tsx                純粋表示
    ├── XxxForm/index.tsx                react-hook-form
    │   ├── schema.ts                    zod
    │   └── styles.module.css
    └── ...
```
