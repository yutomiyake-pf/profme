import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import type { RouteContext, RouteHandler } from "./types";

export interface SessionUser {
  uid: string;
  phoneNumber: string | null;
}

/**
 * セッション Cookie を検証して、ログイン済みユーザだけに先のハンドラを通すミドルウェア。
 * 未ログインなら 401 で短絡し、認証済みなら ctx に `user` を追加する。
 *
 * `withZod` と組み合わせる場合は **withSession を外側** に置くと、
 * バリデーション前に認証チェックが走るので、認証無しのリクエストで body 解析コストを
 * 払わずに済む。
 *
 * ```ts
 * export const POST = createRoute(
 *   withSession(
 *     withZod({ body: bodySchema }, async ({ user, body }) => { ... }),
 *   ),
 * );
 * ```
 */
export function withSession<TCtx extends RouteContext = RouteContext>(
  handler: RouteHandler<TCtx & { user: SessionUser }>,
): RouteHandler<TCtx> {
  return async (ctx) => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return handler({ ...ctx, user });
  };
}
