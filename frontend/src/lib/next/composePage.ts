import "server-only";

import type { ReactNode } from "react";
import type { PageContext, PageHandler, PageMiddleware } from "./types";

/**
 * 複数の PageMiddleware と最終ハンドラを **左から右の順** に並べて、
 * Next.js が期待する `(props) => Promise<ReactNode>` 形式に変換する。
 *
 * - 一番左のミドルウェアが先に走る (=外側)
 * - 各ミドルウェアが ctx に値を追加し、最終ハンドラは全部の合算 ctx を受け取る
 * - API Route 側の `createRoute` と同じ思想
 *
 * ```tsx
 * export default async function Page(props: PageProps) {
 *   return composePage(
 *     withSession({ requireAuth: true }),
 *     withZodSearchParams(searchSchema),
 *     async ({ session, parsedSearchParams }) => <Dashboard />,
 *   )(props);
 * }
 * ```
 */
export function composePage(
  handler: PageHandler<PageContext>,
): (props: PageContext) => Promise<ReactNode>;
export function composePage<TAdd1>(
  mw1: PageMiddleware<TAdd1>,
  handler: PageHandler<PageContext & TAdd1>,
): (props: PageContext) => Promise<ReactNode>;
export function composePage<TAdd1, TAdd2>(
  mw1: PageMiddleware<TAdd1>,
  mw2: PageMiddleware<TAdd2>,
  handler: PageHandler<PageContext & TAdd1 & TAdd2>,
): (props: PageContext) => Promise<ReactNode>;
export function composePage<TAdd1, TAdd2, TAdd3>(
  mw1: PageMiddleware<TAdd1>,
  mw2: PageMiddleware<TAdd2>,
  mw3: PageMiddleware<TAdd3>,
  handler: PageHandler<PageContext & TAdd1 & TAdd2 & TAdd3>,
): (props: PageContext) => Promise<ReactNode>;
export function composePage<TAdd1, TAdd2, TAdd3, TAdd4>(
  mw1: PageMiddleware<TAdd1>,
  mw2: PageMiddleware<TAdd2>,
  mw3: PageMiddleware<TAdd3>,
  mw4: PageMiddleware<TAdd4>,
  handler: PageHandler<PageContext & TAdd1 & TAdd2 & TAdd3 & TAdd4>,
): (props: PageContext) => Promise<ReactNode>;
export function composePage(
  ...args: [...PageMiddleware<unknown>[], PageHandler<PageContext>]
): (props: PageContext) => Promise<ReactNode> {
  const handler = args[args.length - 1] as PageHandler<PageContext>;
  const middlewares = args.slice(0, -1) as PageMiddleware<unknown>[];

  // 右から左へ畳み込む: handler を mw[N-1], mw[N-2], ..., mw[0] の順に包む
  // → 実行時は mw[0] が最も外側 (先に走る)
  const composed = middlewares.reduceRight<PageHandler<PageContext>>(
    (next, mw) => mw(next),
    handler,
  );

  return async (props) => composed(props);
}
