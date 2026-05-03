# Forms (react-hook-form 7.74 + zod 4)

## 必ず守る subscription ルール

`useFormContext()` から直接 `formState.errors` や `watch` を destructure すると **Proxy subscription が効かず、フォーム state が変化しても再レンダリングされない**。子コンポーネントでは必ず以下を使う。

| やりたいこと      | NG (動かないことがある)                              | OK                                              |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------- |
| errors を購読     | `const { formState: { errors } } = useFormContext()` | `const { errors } = useFormState({ control })`  |
| 特定 field を購読 | `const v = watch("name")`                            | `const v = useWatch({ control, name: "name" })` |

`useForm` を直接呼んでいる本人 (= Form のオーナー component) は destructure で OK。罠が発生するのは `useFormContext` 経由のとき。

## errors を動的キーで引けない

`errors[name]?.message` のように **動的 key** で引くと値が取れないことがある (RHF Proxy の挙動)。複数 field を map で扱う場合は事前に hardcoded で取り出す:

```tsx
const { errors } = useFormState({ control, name: ["twitter", "instagram", "github", "linkedin"] });

const snsErrors: Record<SnsField, string | undefined> = {
  twitter: errors.twitter?.message,
  instagram: errors.instagram?.message,
  github: errors.github?.message,
  linkedin: errors.linkedin?.message,
};

// 使う
{
  snsInputs.map(({ name }) => <Input error={snsErrors[name]} {...register(name)} />);
}
```

## controlled + register の罠

`<input value={watch(...)} {...register(...)} />` のような controlled (value) と register (uncontrolled, ref ベース) の混在は React 19 で typing race を引き起こすことがある (DOM が古い value に巻き戻る)。

- 基本: register のみ (uncontrolled)
- 文字数カウントなど value を表示用に使いたいだけなら、Container が自前で `useWatch` した値を Textarea の `value` prop にも流す形が安全 (`useFormContext` 経由ではなく直接 `useForm` の場合のみ。useFormContext 経由なら subscription 問題で結局 race する)

## 共有 constants で zod enum を定義

select / chip 系の選択肢は `src/constants/<feature>.ts` に `as const` tuple で定義し、form schema と API zod の両方で `z.enum(...)` 用に再利用する:

```ts
// src/constants/endorsement.ts
export const ENDORSEMENT_RELATIONSHIPS = ["同期", "先輩", ...] as const;

// form schema
relationship: z.enum(ENDORSEMENT_RELATIONSHIPS, { message: "関係性を選択してください" }),

// API
relationship: z.enum(ENDORSEMENT_RELATIONSHIPS),
```

二重管理にはなるが、client と server の両方でバリデーションを掛けるためそれぞれ持つ。

## Textarea の文字数カウント

`Textarea` コンポーネントは `value` prop を controlled で受けたときだけでなく、register 経由 (uncontrolled) でも内部 ref + `onChange` intercept で length を track する設計。

- `reset()` で値が戻ったとき内部 length が古いまま残る現象がある
  - 必要なら `useWatch` で値を取って `value` props として明示的に渡すと同期する
  - ただし上記の **controlled + register 罠** に注意 (useFormContext 経由ではダメ、useForm 直の component なら OK)

## form mode

- `mode: "onBlur"` をデフォルトにしている (タイプ中の連続バリデーションを避ける)
- submit 時は handleSubmit 内で必ず全フィールド検証される

## reset の使い方

```tsx
methods.reset(); // defaultValues に戻す
methods.reset(newValues); // 任意の値に上書き
```

- 成功 toast 後の form reset は `reset()` のみで OK
- API から最新値を取り直して reset したい場合は値を明示

## Controller / useController が必要なケース

- カスタム input コンポーネントで register が使えない場合 (内部 state を持つ select-like 等)
- 現状のプロジェクトでは標準 input/textarea/select で済んでいるので使用例なし
