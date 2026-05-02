import { NextResponse } from "next/server";
import type {
  CreateMyCustomLinkData,
  CreateMyCustomLinkVariables,
  DeleteAllMyCustomLinksData,
  GetMyProfileData,
  UpdateMyProfileData,
  UpdateMyProfileVariables,
} from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { updateMeRequestSchema } from "./type";

export const runtime = "nodejs";

// GET /api/users/me — ログイン中ユーザのプロフィール
// GetMyProfile は @auth(level: USER) で auth.uid を内部で参照するため、
// admin SDK の executeQuery で session の uid を impersonate する。
//
// NOTE: admin SDK の executeQuery は型上 (name, options) のオーバーロードを
// 許すが、runtime は常に (name, variables, options) の 3 引数で動く実装。
// variables を省くと options が variables 扱いされて "$impersonate is not
// expected" エラーになるため、第 2 引数に必ず undefined を明示する。
export const GET = createRoute(withSession(), async ({ user }) => {
  const { data } = await dataConnectAdmin.executeQuery<GetMyProfileData, undefined>(
    "GetMyProfile",
    undefined,
    { impersonate: { authClaims: { sub: user.uid } } },
  );
  if (!data.user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }
  return NextResponse.json(data.user);
});

// PUT /api/users/me — プロフィール更新
// UpdateMyProfile は @auth(level: USER) で対象行を auth.uid で自動指定する。
// customLinks は別テーブル管理なので「全削除 → 一括再挿入」で同期する
// (max 10 件で件数が小さいため diff せずに replace 戦略で十分)。
export const PUT = createRoute(
  withSession(),
  withZod({ body: updateMeRequestSchema }),
  async ({ user, body }) => {
    const impersonate = { impersonate: { authClaims: { sub: user.uid } } } as const;
    // 空文字を null に正規化して DB へ (text カラムの "" 重複を避ける)
    const toNullable = (v: string) => (v === "" ? null : v);
    await dataConnectAdmin.executeMutation<UpdateMyProfileData, UpdateMyProfileVariables>(
      "UpdateMyProfile",
      {
        displayName: body.displayName,
        university: toNullable(body.university),
        faculty: toNullable(body.faculty),
        grade: toNullable(body.grade),
        bio: toNullable(body.bio),
        gakuchika: toNullable(body.gakuchika),
        avatarUrl: toNullable(body.avatarUrl),
        twitter: toNullable(body.twitter),
        instagram: toNullable(body.instagram),
        github: toNullable(body.github),
        linkedin: toNullable(body.linkedin),
        skills: body.skills,
        hobbies: body.hobbies,
        qualifications: body.qualifications,
      },
      impersonate,
    );

    await dataConnectAdmin.executeMutation<DeleteAllMyCustomLinksData, undefined>(
      "DeleteAllMyCustomLinks",
      undefined,
      impersonate,
    );
    // 並び順は createdAt 昇順なので、フォームの並びを保つために sequential に挿入
    for (const link of body.customLinks) {
      await dataConnectAdmin.executeMutation<CreateMyCustomLinkData, CreateMyCustomLinkVariables>(
        "CreateMyCustomLink",
        { title: link.title, url: link.url },
        impersonate,
      );
    }

    return NextResponse.json({ ok: true });
  },
);
