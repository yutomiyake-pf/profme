import type { NextResponse } from "next/server";

/**
 * API Route のミドルウェアが共通で受け取るコンテキスト。
 * ここを拡張する形で `body` / `query` / `user` などが各ミドルウェアによって追加されていく。
 */
export interface RouteContext {
  request: Request;
}

/**
 * コンテキストを受けて NextResponse を返すハンドラ。
 */
export type RouteHandler<TCtx extends RouteContext = RouteContext> = (
  ctx: TCtx,
) => Promise<NextResponse> | NextResponse;

/**
 * Route ミドルウェア: より広い ctx を要求するハンドラを、より狭い ctx で動くハンドラに変換する。
 */
export type RouteMiddleware<TAdd> = <TCtx extends RouteContext>(
  next: RouteHandler<TCtx & TAdd>,
) => RouteHandler<TCtx>;
