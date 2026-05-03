import { NextResponse } from "next/server";
import type {
  GetIncomingFollowRequestsData,
  GetIncomingFollowRequestsVariables,
} from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { followRequestsQuerySchema } from "./type";

export const runtime = "nodejs";

// 自分宛 (followee=自分) で status=pending のフォロー申請をページネーションで返す。
// totals は同じ where のまま _count だけ select した集計行 (常に 1 要素)。
export const GET = createRoute(
  withSession(),
  withZod({ query: followRequestsQuerySchema }),
  async ({ user, query }) => {
    const { data } = await dataConnectAdmin.executeQuery<
      GetIncomingFollowRequestsData,
      GetIncomingFollowRequestsVariables
    >(
      "GetIncomingFollowRequests",
      { me: user.uid, limit: query.limit, offset: query.offset },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    const requests = data.items.map((row) => ({
      follower: {
        uid: row.follower.uid,
        displayName: row.follower.displayName,
        avatarUrl: row.follower.avatarUrl ?? null,
        university: row.follower.university ?? null,
      },
      requestedAt: row.requestedAt,
    }));
    const total = data.totals[0]?._count ?? 0;
    return NextResponse.json({ requests, total });
  },
);
