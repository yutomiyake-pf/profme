import { NextResponse } from "next/server";
import type {
  ApproveEndorsementData,
  ApproveEndorsementVariables,
  RejectEndorsementData,
  RejectEndorsementVariables,
} from "@dataconnect/generated";
import { createRoute, withSession } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

// POST: 自分宛の pending Endorsement を承認 (status="approved")。
// 0 件 = 既に approved or 行が無い (race) → 冪等扱い。
export async function POST(
  request: Request,
  { params }: { params: Promise<{ endorsementId: string }> },
) {
  const { endorsementId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    await dataConnectAdmin.executeMutation<ApproveEndorsementData, ApproveEndorsementVariables>(
      "ApproveEndorsement",
      { me: user.uid, endorsementId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}

// DELETE: 自分宛の pending Endorsement を却下 (= 行削除)。
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ endorsementId: string }> },
) {
  const { endorsementId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    await dataConnectAdmin.executeMutation<RejectEndorsementData, RejectEndorsementVariables>(
      "RejectEndorsement",
      { me: user.uid, endorsementId },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  })(request);
}
