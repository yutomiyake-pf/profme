import type { NextResponse } from "next/server";

/**
 * API Route のミドルウェアが共通で受け取るコンテキスト。
 * ここを拡張する形で `body` / `query` / `user` などが各ミドルウェアによって
 * 追加されていく。
 */
export interface RouteContext {
  request: Request;
}

/**
 * コンテキストを受けて NextResponse を返すハンドラ。
 * ミドルウェアは「より広い ctx を求めるハンドラ」を「より狭い ctx で動くハンドラ」に変換する。
 */
export type RouteHandler<TCtx extends RouteContext = RouteContext> = (
  ctx: TCtx,
) => Promise<NextResponse> | NextResponse;
