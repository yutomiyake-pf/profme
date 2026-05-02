import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import type { PageContext, PageHandler, PageMiddleware, SessionUser } from "./types";

interface RequireAuthOptions {
  requireAuth: true;
  /** 未認証時のリダイレクト先 (既定 `/login`) */
  redirectTo?: string;
}

interface OptionalAuthOptions {
  requireAuth: false;
}

/**
 * Page の認証チェックミドルウェアファクトリ。
 *
 * - requireAuth: true  → 未ログインなら redirectTo (既定 `/login`) へ redirect。ctx.session は non-null。
 * - requireAuth: false → 認証なしでも通す。ctx.session は null かもしれない。
 *
 * ```tsx
 * export default async function Page(props: PageProps) {
 *   return composePage(
 *     withSession({ requireAuth: true }),
 *     async ({ session }) => <Dashboard uid={session.uid} />,
 *   )(props);
 * }
 * ```
 */
export function withSession(options: RequireAuthOptions): PageMiddleware<{ session: SessionUser }>;
export function withSession(
  options: OptionalAuthOptions,
): PageMiddleware<{ session: SessionUser | null }>;
export function withSession(
  options: RequireAuthOptions | OptionalAuthOptions,
): PageMiddleware<{ session: SessionUser | null }> {
  return <TCtx extends PageContext>(
    next: PageHandler<TCtx & { session: SessionUser | null }>,
  ): PageHandler<TCtx> => {
    return async (ctx) => {
      const session = await getCurrentUser();
      if (options.requireAuth && !session) {
        redirect(options.redirectTo ?? "/login");
      }
      return next({ ...ctx, session });
    };
  };
}
