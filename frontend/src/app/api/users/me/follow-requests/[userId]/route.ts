import { NextResponse } from "next/server";
import type {
  ApproveIncomingFollowData,
  ApproveIncomingFollowVariables,
  RejectIncomingFollowData,
  RejectIncomingFollowVariables,
} from "@dataconnect/generated";
import { createRoute, withSession } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

// POST: 自分宛の pending リクエストを承認 (status="approved")
export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    if (user.uid === userId) {
      return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 });
    }
    // 0 件 = 既に approved or 行が無い (race) — 冪等扱いで成功を返す
    await dataConnectAdmin.executeMutation<
      ApproveIncomingFollowData,
      ApproveIncomingFollowVariables
    >(
      "ApproveIncomingFollow",
      { me: user.uid, otherUid: userId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}

// DELETE: 自分宛の pending リクエストを却下 (= 行削除)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    if (user.uid === userId) {
      return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 });
    }
    await dataConnectAdmin.executeMutation<RejectIncomingFollowData, RejectIncomingFollowVariables>(
      "RejectIncomingFollow",
      { otherUid: userId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}
