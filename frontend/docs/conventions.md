# Conventions — スタイル方針

## CSS Modules 単位

`*.module.css` は **コンポーネント 1 つにつき 1 ファイル** とする。

```
_components/<ComponentName>/
├── index.tsx
└── styles.module.css
```

- グローバル CSS は `src/app/globals.css` のみ (CSS 変数定義 + reset + ごく少数の utility)。それ以外で `*.css` を新規作成しない。
- `:global(...)` は基本使わない。サードパーティ製ライブラリの class を上書きする時の最終手段。
- 複数コンポーネントで使う class は、**CSS を共有せず Component を共有する** (`_components/` に切り出す)。

## CSS 変数を使う

色・余白・角丸・影・フォント・transition は `globals.css` の CSS 変数のみを使う。**ハードコードの値 (`#fff`, `16px` 等) を `*.module.css` に書かない**。

| 用途       | 変数                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 色         | `--color-*` (`background`, `surface`, `foreground`, `primary`, `accent`, `gray-50`〜`900`, `tag-*`, `success`/`warning`/`error`/`info`) |
| 名刺テーマ | `--theme-<name>-start` / `--theme-<name>-end`                                                                                           |
| 余白       | `--spacing-xs` (4px) / `sm` (8) / `md` (16) / `lg` (24) / `xl` (32) / `2xl` (48) / `3xl` (64)                                           |
| 角丸       | `--radius-sm` / `md` / `lg` / `xl` / `full`                                                                                             |
| 影         | `--shadow-sm` / `md` / `lg` / `xl`                                                                                                      |
| フォント   | `--font-sans` / `--font-display`、`--font-size-*`、`--font-weight-*`、`--line-height-*`                                                 |
| Layout     | `--max-width-content`、`--header-height`                                                                                                |
| Transition | `--transition-fast` / `normal` / `slow`                                                                                                 |

新しい色やサイズが必要になったら **まず `globals.css` に変数を足す**。`*.module.css` には書かない。

例外として許す生の値:

- `0`, `1px` (border 幅), `100%`, `auto`, `100dvh` 等の汎用値
- `flex`, `grid` などのキーワード

## margin より gap を使う

レイアウトの間隔は **flex/grid + `gap` で表現する**。`margin` は原則使わない。

```css
/* OK */
.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* NG: 子の margin で間隔を作らない */
.item + .item {
  margin-top: var(--spacing-md);
}
```

理由:

- 親 (= レイアウト責任者) で間隔が完結する。子は再利用しても余白を持ち出さない。
- `:first-child` / `:last-child` の例外調整が不要。
- 順序変更や条件分岐 (`{cond && <X/>}`) で margin collapse の罠が出ない。

`margin` を使ってよい例外:

- ページ中央寄せの `margin-inline: auto`
- どうしても親で gap が表現できない時 (ほぼ無い)

`padding` は **要素の内側余白** なので普通に使う。これは margin の代替ではない。

## class 結合は `clsx`

複数 class や条件付き class は `clsx` を使う。テンプレート文字列で組まない。

```tsx
import clsx from "clsx";

<div className={clsx(styles.card, isActive && styles.active, styles[`padding-${size}`])} />;
```

## bracket notation でのバリアント class

`Card` の `padding-sm/md/lg` のように、props の値で class を切り替える時は `styles[\`padding-${size}\`]` を使う。`if` で 1 個ずつ書かない。

## レスポンシブ

メディアクエリは `*.module.css` 内に直接書く。breakpoint 用の変数や mixin は今のところ用意していない (必要になったら `globals.css` で定数化する)。
