import type { NextResponse } from "next/server";
import type { RouteContext, RouteHandler, RouteMiddleware } from "./types";

/**
 * 複数の RouteMiddleware と最終ハンドラを左から右の順に並べて、
 * Next.js が期待する `(request) => Response` 形式に変換する。
 *
 * - 一番左のミドルウェアが先に走る (=外側)
 * - 各ミドルウェアが ctx に値を追加し、最終ハンドラは合算 ctx を受け取る
 *
 * ```ts
 * export const POST = createRoute(
 *   withSession(),
 *   withZod({ body: schema }),
 *   async ({ user, body }) => NextResponse.json({...}),
 * );
 * ```
 */
export function createRoute(
  handler: RouteHandler<RouteContext>,
): (request: Request) => Promise<NextResponse>;
export function createRoute<TAdd1>(
  mw1: RouteMiddleware<TAdd1>,
  handler: RouteHandler<RouteContext & TAdd1>,
): (request: Request) => Promise<NextResponse>;
export function createRoute<TAdd1, TAdd2>(
  mw1: RouteMiddleware<TAdd1>,
  mw2: RouteMiddleware<TAdd2>,
  handler: RouteHandler<RouteContext & TAdd1 & TAdd2>,
): (request: Request) => Promise<NextResponse>;
export function createRoute<TAdd1, TAdd2, TAdd3>(
  mw1: RouteMiddleware<TAdd1>,
  mw2: RouteMiddleware<TAdd2>,
  mw3: RouteMiddleware<TAdd3>,
  handler: RouteHandler<RouteContext & TAdd1 & TAdd2 & TAdd3>,
): (request: Request) => Promise<NextResponse>;
export function createRoute<TAdd1, TAdd2, TAdd3, TAdd4>(
  mw1: RouteMiddleware<TAdd1>,
  mw2: RouteMiddleware<TAdd2>,
  mw3: RouteMiddleware<TAdd3>,
  mw4: RouteMiddleware<TAdd4>,
  handler: RouteHandler<RouteContext & TAdd1 & TAdd2 & TAdd3 & TAdd4>,
): (request: Request) => Promise<NextResponse>;
export function createRoute(
  ...args: [...RouteMiddleware<unknown>[], RouteHandler<RouteContext>]
): (request: Request) => Promise<NextResponse> {
  const handler = args[args.length - 1] as RouteHandler<RouteContext>;
  const middlewares = args.slice(0, -1) as RouteMiddleware<unknown>[];

  // 右から左へ畳み込む → 実行時は左のミドルウェアから先に走る
  const composed = middlewares.reduceRight<RouteHandler<RouteContext>>(
    (next, mw) => mw(next),
    handler,
  );

  return async (request) => composed({ request });
}
