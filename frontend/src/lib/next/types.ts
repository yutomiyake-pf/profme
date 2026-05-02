import type { ReactNode } from "react";
import type { getCurrentUser } from "@/lib/auth/server";

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * Page (Server Component) が受け取る基本コンテキスト。
 * 各ミドルウェアはこの型を拡張していく。
 */
export interface PageContext {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * コンテキストを受けて ReactNode を返す Page ハンドラ。
 */
export type PageHandler<TCtx extends PageContext = PageContext> = (
  ctx: TCtx,
) => Promise<ReactNode> | ReactNode;

/**
 * Page ミドルウェア: より広い ctx を要求するハンドラを、より狭い ctx で動くハンドラに変換する。
 * `<TCtx extends PageContext>` で polymorphic、つまり「呼び出し側の ctx 型を保ったまま TAdd を足す」。
 */
export type PageMiddleware<TAdd> = <TCtx extends PageContext>(
  next: PageHandler<TCtx & TAdd>,
) => PageHandler<TCtx>;
