import type { NextResponse } from "next/server";
import type { RouteContext, RouteHandler } from "./types";

/**
 * RouteHandler<TCtx> を Next.js の API Route が期待する `(request) => Response` 形式に変換する。
 * ミドルウェア (withZod / withSession など) を積み重ねた一番外側で呼ぶ。
 *
 * ```ts
 * export const POST = createRoute(
 *   withSession(
 *     withZod({ body: schema }, async ({ user, body }) => NextResponse.json({...})),
 *   ),
 * );
 * ```
 */
export const createRoute = <TCtx extends RouteContext = RouteContext>(
  handler: RouteHandler<TCtx>,
): ((request: Request) => Promise<NextResponse>) => {
  return async (request) => handler({ request } as TCtx);
};
