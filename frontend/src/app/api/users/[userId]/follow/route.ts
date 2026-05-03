import { NextResponse } from "next/server";
import type {
  ApproveIncomingFollowData,
  ApproveIncomingFollowVariables,
  CreateFollowRequestData,
  CreateFollowRequestVariables,
  GetFollowRelationshipData,
  GetFollowRelationshipVariables,
} from "@dataconnect/generated";
import { createRoute, withSession } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import type { FollowRelationship, FollowStatus } from "./type";

export const runtime = "nodejs";

// 行が無ければ "none"、status が "approved" 以外 (今は "pending" のみ) は安全側に倒して "pending" 扱い
const toStatus = (raw: { status: string } | undefined): FollowStatus => {
  if (!raw) return "none";
  return raw.status === "approved" ? "approved" : "pending";
};

const fetchRelationship = async (myUid: string, otherUid: string): Promise<FollowRelationship> => {
  const { data } = await dataConnectAdmin.executeQuery<
    GetFollowRelationshipData,
    GetFollowRelationshipVariables
  >("GetFollowRelationship", { other: otherUid }, { impersonate: { authClaims: { sub: myUid } } });
  return {
    outgoing: toStatus(data.outgoing),
    incoming: toStatus(data.incoming),
  };
};

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    if (user.uid === userId) {
      // 自分自身をフォローすることはできない
      return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 });
    }
    const relationship = await fetchRelationship(user.uid, userId);
    return NextResponse.json(relationship);
  })(request);
}

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return createRoute(withSession(), async ({ user }) => {
    if (user.uid === userId) {
      return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 });
    }
    const impersonate = { impersonate: { authClaims: { sub: user.uid } } } as const;
    const current = await fetchRelationship(user.uid, userId);

    // 「フォローする」押下時の分岐:
    //   1. 相手→自分 の pending がある場合は、新規申請ではなく既存申請の承認として扱う
    //      (相手が送ってきた申請を「フォローする」で受け入れる UX)
    //   2. 自分→相手 が無ければ pending で新規作成
    //   3. 既に自分→相手 がある場合 (pending / approved) は何もしない (idempotent)
    if (current.incoming === "pending") {
      await dataConnectAdmin.executeMutation<
        ApproveIncomingFollowData,
        ApproveIncomingFollowVariables
      >("ApproveIncomingFollow", { otherUid: userId }, impersonate);
    } else if (current.outgoing === "none") {
      await dataConnectAdmin.executeMutation<CreateFollowRequestData, CreateFollowRequestVariables>(
        "CreateFollowRequest",
        { followeeUid: userId },
        impersonate,
      );
    }

    // 書き込み後の状態を再取得して返す。mutation の戻り値からは派生フィールド
    // (approvedAt 等) や両方向の最終状態が分からないため
    const updated = await fetchRelationship(user.uid, userId);
    return NextResponse.json(updated);
  })(request);
}
