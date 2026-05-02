import { NextResponse } from "next/server";
import { z } from "zod";
import type { RouteContext, RouteHandler } from "./types";

/**
 * リクエスト body / query を zod で検証するミドルウェア。
 * 検証 OK で ctx に `body` / `query` を追加して次のハンドラへ。
 * 検証 NG なら 400 を返して短絡。
 *
 * 単独使用例:
 * ```ts
 * export const POST = createRoute(
 *   withZod({ body: bodySchema }, async ({ body }) => NextResponse.json({...})),
 * );
 * ```
 *
 * 認証と組み合わせる例: withSession の中に withZod を入れる (外側ほど先に実行される)。
 */
export function withZod<
  TBody extends z.ZodType | undefined = undefined,
  TQuery extends z.ZodType | undefined = undefined,
  TCtx extends RouteContext = RouteContext,
>(
  schemas: { body?: TBody; query?: TQuery },
  handler: RouteHandler<
    TCtx & {
      body: TBody extends z.ZodType ? z.infer<TBody> : undefined;
      query: TQuery extends z.ZodType ? z.infer<TQuery> : undefined;
    }
  >,
): RouteHandler<TCtx> {
  return async (ctx) => {
    let body: unknown = undefined;
    let query: unknown = undefined;

    if (schemas.body) {
      let raw: unknown;
      try {
        // 後段でも request.json() を再利用できるよう clone() しておく。
        raw = await ctx.request.clone().json();
      } catch {
        return NextResponse.json({ error: "invalid_body" }, { status: 400 });
      }
      const parsed = schemas.body.safeParse(raw);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "validation_error", issues: parsed.error.issues },
          { status: 400 },
        );
      }
      body = parsed.data;
    }

    if (schemas.query) {
      const url = new URL(ctx.request.url);
      const rawQuery = Object.fromEntries(url.searchParams);
      const parsed = schemas.query.safeParse(rawQuery);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "validation_error", issues: parsed.error.issues },
          { status: 400 },
        );
      }
      query = parsed.data;
    }

    return handler({
      ...ctx,
      body: body as TBody extends z.ZodType ? z.infer<TBody> : undefined,
      query: query as TQuery extends z.ZodType ? z.infer<TQuery> : undefined,
    });
  };
}
