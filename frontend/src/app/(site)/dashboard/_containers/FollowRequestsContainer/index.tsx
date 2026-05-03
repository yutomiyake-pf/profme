"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FOLLOW_REQUESTS_PAGE_SIZE,
  followRequestActionResponseSchema,
  followRequestsResponseSchema,
} from "@/app/api/users/me/follow-requests/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface FollowRequestUser {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
  university: string | null;
}

export interface FollowRequestItem {
  follower: FollowRequestUser;
  requestedAt: string;
}

export interface FollowRequestsRenderProps {
  requests: FollowRequestItem[];
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  pendingIds: Set<string>;
  loadMore: () => Promise<void>;
  approve: (userId: string) => Promise<void>;
  reject: (userId: string) => Promise<void>;
}

interface Props {
  children: (props: FollowRequestsRenderProps) => ReactNode;
}

// 自分宛のフォロー申請を 20 件ずつページネーションで取得し、
// 承認/却下の副作用 (=同じ行を local list から除外 + total を 1 減らす) を提供する。
export const FollowRequestsContainer = ({ children }: Props) => {
  const [requests, setRequests] = useState<FollowRequestItem[]>([]);
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
        `/api/users/me/follow-requests?limit=${FOLLOW_REQUESTS_PAGE_SIZE}&offset=${offset}`,
        { schema: followRequestsResponseSchema, cache: "no-store" },
      );
      const next: FollowRequestItem[] = data.requests.map((r) => ({
        follower: {
          uid: r.follower.uid,
          displayName: r.follower.displayName,
          avatarUrl: r.follower.avatarUrl,
          university: r.follower.university,
        },
        requestedAt: r.requestedAt,
      }));
      setRequests((prev) => (offset === 0 ? next : [...prev, ...next]));
      setTotal(data.total);
      // 取得済み件数 (= offset + 受け取った件数) が total に達したら終了
      setHasMore(offset + next.length < data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // StrictMode の二重 effect を防ぐため、初回 fetch を didMount で 1 回に絞る
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    void fetchPage(0);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isInitialLoading) return;
    await fetchPage(requests.length);
  }, [fetchPage, requests.length, hasMore, isLoadingMore, isInitialLoading]);

  const runAction = useCallback(
    async (userId: string, method: "POST" | "DELETE", failureMessage: string) => {
      if (pendingIds.has(userId)) return;
      setPendingIds((prev) => new Set(prev).add(userId));
      try {
        await clientFetcher(`/api/users/me/follow-requests/${encodeURIComponent(userId)}`, {
          method,
          schema: followRequestActionResponseSchema,
        });
        setRequests((prev) => prev.filter((r) => r.follower.uid !== userId));
        setTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : failureMessage);
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

  const approve = useCallback(
    (userId: string) => runAction(userId, "POST", "承認に失敗しました"),
    [runAction],
  );
  const reject = useCallback(
    (userId: string) => runAction(userId, "DELETE", "却下に失敗しました"),
    [runAction],
  );

  return (
    <>
      {children({
        requests,
        total,
        isInitialLoading,
        isLoadingMore,
        hasMore,
        error,
        pendingIds,
        loadMore,
        approve,
        reject,
      })}
    </>
  );
};
