import { NextResponse } from "next/server";
import type { GetMyFollowersData, GetMyFollowersVariables } from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { followersQuerySchema } from "./type";

export const runtime = "nodejs";

// 自分のフォロワー (followee=自分 で status=approved な行) をページネーションで返す。
export const GET = createRoute(
  withSession(),
  withZod({ query: followersQuerySchema }),
  async ({ user, query }) => {
    const { data } = await dataConnectAdmin.executeQuery<
      GetMyFollowersData,
      GetMyFollowersVariables
    >(
      "GetMyFollowers",
      { me: user.uid, limit: query.limit, offset: query.offset },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    const followers = data.items.map((row) => ({
      follower: {
        uid: row.follower.uid,
        displayName: row.follower.displayName,
        avatarUrl: row.follower.avatarUrl ?? null,
        university: row.follower.university ?? null,
      },
      approvedAt: row.approvedAt ?? null,
    }));
    const total = data.totals[0]?._count ?? 0;
    return NextResponse.json({ followers, total });
  },
);
