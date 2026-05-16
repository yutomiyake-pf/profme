"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FOLLOWERS_PAGE_SIZE,
  followerActionResponseSchema,
  followersResponseSchema,
} from "@/app/api/users/me/followers/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface FollowerUser {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
  university: string | null;
}

export interface FollowerItem {
  follower: FollowerUser;
  approvedAt: string | null;
}

export interface FollowersRenderProps {
  followers: FollowerItem[];
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  pendingIds: Set<string>;
  loadMore: () => Promise<void>;
  remove: (userId: string) => Promise<void>;
}

interface Props {
  children: (props: FollowersRenderProps) => ReactNode;
}

// 自分のフォロワー (= 自分が関与する approved な follow 行 / 申請の向き不問)
// を 20 件ずつ取得し、解除 (= 行削除) の副作用を提供する。
// API 側で「自分でない側」の user が follower にマップされて返ってくる。
export const FollowersContainer = ({ children }: Props) => {
  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const fetchPage = useCallback(async (offset: number) => {
    if (offset === 0) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    try {
      const data = await clientFetcher(
        `/api/users/me/followers?limit=${FOLLOWERS_PAGE_SIZE}&offset=${offset}`,
        { schema: followersResponseSchema, cache: "no-store" },
      );
      const next: FollowerItem[] = data.followers.map((f) => ({
        follower: {
          uid: f.follower.uid,
          displayName: f.follower.displayName,
          avatarUrl: f.follower.avatarUrl,
          university: f.follower.university,
        },
        approvedAt: f.approvedAt,
      }));
      setFollowers((prev) => (offset === 0 ? next : [...prev, ...next]));
      setTotal(data.total);
      setHasMore(offset + next.length < data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    void fetchPage(0);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isInitialLoading) return;
    await fetchPage(followers.length);
  }, [fetchPage, followers.length, hasMore, isLoadingMore, isInitialLoading]);

  const remove = useCallback(
    async (userId: string) => {
      if (pendingIds.has(userId)) return;
      setPendingIds((prev) => new Set(prev).add(userId));
      try {
        await clientFetcher(`/api/users/me/followers/${encodeURIComponent(userId)}`, {
          method: "DELETE",
          schema: followerActionResponseSchema,
        });
        setFollowers((prev) => prev.filter((f) => f.follower.uid !== userId));
        setTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "解除に失敗しました");
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    [pendingIds],
  );

  return (
    <>
      {children({
        followers,
        total,
        isInitialLoading,
        isLoadingMore,
        hasMore,
        error,
        pendingIds,
        loadMore,
        remove,
      })}
    </>
  );
};
