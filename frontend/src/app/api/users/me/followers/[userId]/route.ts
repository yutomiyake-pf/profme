import { NextResponse } from "next/server";
import type { RemoveFollowerData, RemoveFollowerVariables } from "@dataconnect/generated";
import { createRoute, withSession } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

// DELETE: 自分のフォロワーを解除 (= 自分が関与する approved 行を削除)
// 申請の向きはどちらでもあり得るので mutation 側は deleteMany + _or で
// 双方向を 1 クエリで消す。$me は verified session の uid を渡す。
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    if (user.uid === userId) {
      return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 });
    }
    await dataConnectAdmin.executeMutation<RemoveFollowerData, RemoveFollowerVariables>(
      "RemoveFollower",
      { me: user.uid, otherUid: userId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}
