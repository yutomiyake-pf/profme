import { NextResponse } from "next/server";
import type { GetMyFollowersData, GetMyFollowersVariables } from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { followersQuerySchema } from "./type";

export const runtime = "nodejs";

// 自分のフォロワー (= 自分が関与する approved な follow 行) をページネーションで返す。
// 申請の向きはどちらでもあり得るため、各行から「自分でない側」の user を選んで返す。
// (followerUid === 自分 なら followee 側、そうでなければ follower 側が相手)
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
    const followers = data.items.map((row) => {
      const other = row.followerUid === user.uid ? row.followee : row.follower;
      return {
        follower: {
          uid: other.uid,
          displayName: other.displayName,
          avatarUrl: other.avatarUrl ?? null,
          university: other.university ?? null,
        },
        approvedAt: row.approvedAt ?? null,
      };
    });
    const total = data.totals[0]?._count ?? 0;
    return NextResponse.json({ followers, total });
  },
);
