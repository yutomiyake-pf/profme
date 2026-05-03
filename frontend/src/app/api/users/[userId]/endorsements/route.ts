import { NextResponse } from "next/server";
import type {
  CreateEndorsementRequestData,
  CreateEndorsementRequestVariables,
  GetEndorsementsByRecipientData,
  GetEndorsementsByRecipientVariables,
  GetFollowRelationshipData,
  GetFollowRelationshipVariables,
} from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { createEndorsementRequestSchema, endorsementsQuerySchema } from "./type";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return createRoute(
    withZod({ query: endorsementsQuerySchema }),
    async ({ query }) => {
      const { data } = await dataConnectAdmin.executeQuery<
        GetEndorsementsByRecipientData,
        GetEndorsementsByRecipientVariables
      >("GetEndorsementsByRecipient", {
        recipientUid: userId,
        limit: query.limit + 1,
        offset: query.offset,
      });

      const hasMore = data.endorsements.length > query.limit;
      const endorsements = hasMore ? data.endorsements.slice(0, query.limit) : data.endorsements;

      return NextResponse.json({ endorsements, hasMore });
    },
  )(request);
}

// recipient のフォロワー (= author 自身の outgoing approved、または incoming approved
// = 相手の申請を author が承認済) のみ endorsement を投稿できる。
// UI 側で出し分けてはいるが、API 経由で直接叩かれるケースを防ぐためサーバ側でも検証する。
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return createRoute(
    withSession(),
    withZod({ body: createEndorsementRequestSchema }),
    async ({ user, body }) => {
      if (user.uid === userId) {
        return NextResponse.json({ error: "cannot_endorse_self" }, { status: 400 });
      }
      const impersonate = { impersonate: { authClaims: { sub: user.uid } } } as const;

      const { data: rel } = await dataConnectAdmin.executeQuery<
        GetFollowRelationshipData,
        GetFollowRelationshipVariables
      >("GetFollowRelationship", { other: userId }, impersonate);
      // 自分→相手 が approved、または 相手→自分 を自分が approved していれば follower
      const isFollower =
        rel.outgoing?.status === "approved" || rel.incoming?.status === "approved";
      if (!isFollower) {
        return NextResponse.json({ error: "must_be_follower" }, { status: 403 });
      }

      await dataConnectAdmin.executeMutation<
        CreateEndorsementRequestData,
        CreateEndorsementRequestVariables
      >(
        "CreateEndorsementRequest",
        {
          recipientUid: userId,
          relationship: body.relationship,
          episode: body.episode,
          tags: [...body.tags],
        },
        impersonate,
      );

      return NextResponse.json({ ok: true });
    },
  )(request);
}
