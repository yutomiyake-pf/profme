"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ENDORSEMENT_PAGE_SIZE,
  endorsementsResponseSchema,
} from "@/app/api/users/[userId]/endorsements/type";
import { endorsementRequestActionResponseSchema } from "@/app/api/users/me/endorsement-requests/type";
import { useAuth } from "@/app/_providers/AuthProvider";
import { clientFetcher } from "@/lib/fetcher/client";

export interface MyEndorsementAuthor {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface MyEndorsementItem {
  id: string;
  relationship: string | null;
  episode: string;
  tags: string[];
  approvedAt: string | null;
  author: MyEndorsementAuthor;
}

export interface MyEndorsementsRenderProps {
  endorsements: MyEndorsementItem[];
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  pendingIds: Set<string>;
  loadMore: () => Promise<void>;
  remove: (endorsementId: string) => Promise<void>;
}

interface Props {
  children: (props: MyEndorsementsRenderProps) => ReactNode;
}

// 自分宛 (recipient=自分) で status=approved の Endorsement を 20 件ずつ取得し、
// 物理削除 (= 行削除) の副作用を提供する。
// 自分の uid は AuthProvider (Firebase client SDK) から取得し、prop drilling を避ける。
// データ取得は名刺ページと同じ /api/users/[uid]/endorsements を再利用 (owner 判定で
// endorsementsVisible に関わらず全件返る)。
export const MyEndorsementsContainer = ({ children }: Props) => {
  const { user } = useAuth();
  const myUid = user?.uid;
  const [endorsements, setEndorsements] = useState<MyEndorsementItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const fetchPage = useCallback(
    async (uid: string, offset: number) => {
      if (offset === 0) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      try {
        const data = await clientFetcher(
          `/api/users/${encodeURIComponent(uid)}/endorsements?limit=${ENDORSEMENT_PAGE_SIZE}&offset=${offset}`,
          { schema: endorsementsResponseSchema, cache: "no-store" },
        );
        const next: MyEndorsementItem[] = data.endorsements.map((e) => ({
          id: e.id,
          relationship: e.relationship,
          episode: e.episode,
          tags: e.tags,
          approvedAt: e.approvedAt,
          author: {
            uid: e.author.uid,
            displayName: e.author.displayName,
            avatarUrl: e.author.avatarUrl,
          },
        }));
        setEndorsements((prev) => (offset === 0 ? next : [...prev, ...next]));
        setTotal(data.total);
        setHasMore(offset + next.length < data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "読み込みに失敗しました");
      } finally {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // user が AuthProvider 経由で揃った直後に 1 回だけ初回 fetch を走らせる。
  // hydrate 直後は user=null のことがあるので uid 確定をトリガにする。
  const didMount = useRef(false);
  useEffect(() => {
    if (!myUid || didMount.current) return;
    didMount.current = true;
    void fetchPage(myUid, 0);
  }, [fetchPage, myUid]);

  const loadMore = useCallback(async () => {
    if (!myUid || !hasMore || isLoadingMore || isInitialLoading) return;
    await fetchPage(myUid, endorsements.length);
  }, [fetchPage, myUid, endorsements.length, hasMore, isLoadingMore, isInitialLoading]);

  const remove = useCallback(
    async (id: string) => {
      if (pendingIds.has(id)) return;
      setPendingIds((prev) => new Set(prev).add(id));
      try {
        await clientFetcher(`/api/users/me/endorsements/${encodeURIComponent(id)}`, {
          method: "DELETE",
          schema: endorsementRequestActionResponseSchema,
        });
        setEndorsements((prev) => prev.filter((e) => e.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "削除に失敗しました");
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [pendingIds],
  );

  return (
    <>
      {children({
        endorsements,
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
