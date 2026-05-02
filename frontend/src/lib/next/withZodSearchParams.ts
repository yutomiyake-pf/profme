import "server-only";

import { z } from "zod";
import type { PageContext, PageHandler, PageMiddleware } from "./types";

/**
 * Page の searchParams を zod スキーマで検証するミドルウェアファクトリ。
 * 検証 OK で ctx.parsedSearchParams にパース結果を入れて次のハンドラへ。
 * 検証 NG なら例外を throw → Next.js の error.tsx で表示される。
 *
 * 不正値はデフォルトに倒したい場合はスキーマ側で `.catch(...)` を使う。
 *
 * ```tsx
 * const schema = z.object({
 *   tab: z.enum(["mycard", "followers"]).catch("mycard").optional(),
 * });
 *
 * return composePage(
 *   withZodSearchParams(schema),
 *   async ({ parsedSearchParams }) => <Dashboard tab={parsedSearchParams.tab} />,
 * )(props);
 * ```
 */
export function withZodSearchParams<TSchema extends z.ZodType>(
  schema: TSchema,
): PageMiddleware<{ parsedSearchParams: z.infer<TSchema> }> {
  return <TCtx extends PageContext>(
    next: PageHandler<TCtx & { parsedSearchParams: z.infer<TSchema> }>,
  ): PageHandler<TCtx> => {
    return async (ctx) => {
      const raw = await ctx.searchParams;
      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`searchParams_validation_failed: ${parsed.error.message}`);
      }
      return next({ ...ctx, parsedSearchParams: parsed.data });
    };
  };
}
