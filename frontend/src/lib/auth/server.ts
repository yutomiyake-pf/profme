import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "__session";
// Cookie 期限は 1 日。AuthProvider 側で onIdTokenChanged をフックして
// 55 分ごとに re-issue するので、active なユーザは常に最新状態を保てる。
// 1 日アクセスがなければ再ログインを強制する (盗難時の影響窓を狭める)。
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * 同一リクエスト内でメモ化されたカレントユーザ取得。
 * Server Components / API Route のどちらからでも使える。
 */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return {
      uid: decoded.uid,
      phoneNumber: decoded.phone_number ?? null,
    };
  } catch {
    return null;
  }
});
