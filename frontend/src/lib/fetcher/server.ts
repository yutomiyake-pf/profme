import "server-only";
import { cookies } from "next/headers";
import type { z } from "zod";
import { type BaseFetcherOptions, baseFetch } from "./core";

/**
 * サーバ (RSC / API Route / Server Action) から呼ぶ fetcher。
 * Next.js のサーバ fetch は絶対 URL が必須なので NEXT_PUBLIC_SITE_URL を必ず設定すること。
 *
 * ブラウザの Cookie は自動転送されないので、現在のリクエストの cookie を
 * `Cookie` ヘッダとして詰め直してから baseFetch に渡す
 * (= 自分自身の API Route が withSession() でセッションを引けるようにする)。
 */
export function serverFetcher<TSchema extends z.ZodType>(
  endpoint: string,
  options: BaseFetcherOptions<TSchema>,
): Promise<z.infer<TSchema>>;
export function serverFetcher<TSchema extends z.ZodType>(
  endpoint: string,
  options: BaseFetcherOptions<TSchema> & { throwErr: false },
): Promise<z.infer<TSchema> | null>;
export async function serverFetcher<TSchema extends z.ZodType>(
  endpoint: string,
  options: BaseFetcherOptions<TSchema>,
): Promise<z.infer<TSchema> | null> {
  const cookieHeader = (await cookies()).toString();
  return baseFetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
}
