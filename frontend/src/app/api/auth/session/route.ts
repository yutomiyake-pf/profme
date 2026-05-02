import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, getUserByPhone } from "@dataconnect/generated";
import { createRoute, withZod } from "@/app/api/utils";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "@/lib/auth/server";
import { adminAuth, dataConnect } from "@/lib/firebase/admin";

// firebase-admin SDK は Node.js でしか動かないので Edge Runtime は使えない。
export const runtime = "nodejs";

const postBodySchema = z.object({
  idToken: z.string().min(1),
  // 新規ユーザのみ必須。既存ユーザのリクエストでは無視する想定なので optional。
  displayName: z.string().trim().min(1).max(20).optional(),
});

export const POST = createRoute(
  withZod({ body: postBodySchema }),
  async ({ body }) => {
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(body.idToken);
    } catch {
      return NextResponse.json({ error: "id_token_verification_failed" }, { status: 401 });
    }

    const { uid, phone_number: phoneNumber } = decoded;
    if (!phoneNumber) {
      return NextResponse.json({ error: "phone_required" }, { status: 400 });
    }

    // signInWithPhoneNumber が呼ばれた時点で Firebase Auth 側にはユーザが
    // 作られているが、Profme の DB (Data Connect) にはまだ行が無い可能性がある。
    // 電話番号で既存行を検索し、無ければ displayName を必須にして新規行を作る。
    // (uid 検索ではなく phoneNumber 検索なのは、別端末から再ログインした
    //  ケースを既存ユーザとして扱えるようにするため)
    const { data } = await getUserByPhone(dataConnect, { phoneNumber });
    if (!data.user) {
      if (!body.displayName) {
        return NextResponse.json({ error: "display_name_required" }, { status: 400 });
      }
      await createUser(dataConnect, {
        uid,
        phoneNumber,
        displayName: body.displayName,
      });
    }

    // ID Token は短命 (1 時間) なので毎回再ログインを強いるのは UX が悪い。
    // 長寿命のセッション Cookie に焼き直し、以降は Cookie で認証する。
    const sessionCookie = await adminAuth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000,
    });
    return res;
  },
);

export const DELETE = createRoute(async () => {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
});
