import { NextResponse } from "next/server";
import type {
  DeleteMyEndorsementData,
  DeleteMyEndorsementVariables,
} from "@dataconnect/generated";
import { createRoute, withSession } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

// DELETE: 自分宛 Endorsement (status 問わず) の物理削除。
// ダッシュボードの「評価」タブから approved な評価を後から消す用途。
// recipient=自分 を mutation の where 条件で固定しているので、他人の評価は触れない。
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ endorsementId: string }> },
) {
  const { endorsementId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    await dataConnectAdmin.executeMutation<DeleteMyEndorsementData, DeleteMyEndorsementVariables>(
      "DeleteMyEndorsement",
      { me: user.uid, endorsementId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}
