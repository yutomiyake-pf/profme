import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import type { RouteContext, RouteHandler, RouteMiddleware } from "./types";

export interface SessionUser {
  uid: string;
  phoneNumber: string | null;
}

/**
 * セッション Cookie を検証して、ログイン済みユーザだけ通すミドルウェアファクトリ。
 * 未ログインなら 401 で短絡し、認証済みなら ctx に `user` を追加する。
 *
 * ```ts
 * export const POST = createRoute(
 *   withSession(),
 *   withZod({ body: schema }),
 *   async ({ user, body }) => NextResponse.json({...}),
 * );
 * ```
 */
export function withSession(): RouteMiddleware<{ user: SessionUser }> {
  return <TCtx extends RouteContext>(
    next: RouteHandler<TCtx & { user: SessionUser }>,
  ): RouteHandler<TCtx> => {
    return async (ctx) => {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      return next({ ...ctx, user });
    };
  };
}
