import { NextResponse } from "next/server";
import type {
  GetPendingEndorsementsForRecipientData,
  GetPendingEndorsementsForRecipientVariables,
} from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { endorsementRequestsQuerySchema } from "./type";

export const runtime = "nodejs";

// 自分宛 (recipient=自分) で status=pending の Endorsement をページネーションで返す。
export const GET = createRoute(
  withSession(),
  withZod({ query: endorsementRequestsQuerySchema }),
  async ({ user, query }) => {
    const { data } = await dataConnectAdmin.executeQuery<
      GetPendingEndorsementsForRecipientData,
      GetPendingEndorsementsForRecipientVariables
    >(
      "GetPendingEndorsementsForRecipient",
      { me: user.uid, limit: query.limit, offset: query.offset },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    const endorsements = data.items.map((row) => ({
      id: row.id,
      relationship: row.relationship ?? null,
      episode: row.episode,
      tags: row.tags,
      createdAt: row.createdAt,
      author: {
        uid: row.author.uid,
        displayName: row.author.displayName,
        avatarUrl: row.author.avatarUrl ?? null,
      },
    }));
    const total = data.totals[0]?._count ?? 0;
    return NextResponse.json({ endorsements, total });
  },
);
