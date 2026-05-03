"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ENDORSEMENT_REQUESTS_PAGE_SIZE,
  endorsementRequestActionResponseSchema,
  endorsementRequestsResponseSchema,
} from "@/app/api/users/me/endorsement-requests/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface EndorsementRequestAuthor {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface EndorsementRequestItem {
  id: string;
  relationship: string | null;
  episode: string;
  tags: string[];
  createdAt: string;
  author: EndorsementRequestAuthor;
}

export interface EndorsementRequestsRenderProps {
  endorsements: EndorsementRequestItem[];
  total: number;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  pendingIds: Set<string>;
  loadMore: () => Promise<void>;
  approve: (endorsementId: string) => Promise<void>;
  reject: (endorsementId: string) => Promise<void>;
}

interface Props {
  children: (props: EndorsementRequestsRenderProps) => ReactNode;
}

// 自分宛 (recipient=自分) で status=pending の Endorsement を 20 件ずつ取得し、
// 承認/却下 (削除) の副作用を提供する。
export const EndorsementRequestsContainer = ({ children }: Props) => {
  const [endorsements, setEndorsements] = useState<EndorsementRequestItem[]>([]);
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
        `/api/users/me/endorsement-requests?limit=${ENDORSEMENT_REQUESTS_PAGE_SIZE}&offset=${offset}`,
        { schema: endorsementRequestsResponseSchema, cache: "no-store" },
      );
      const next: EndorsementRequestItem[] = data.endorsements.map((e) => ({
        id: e.id,
        relationship: e.relationship,
        episode: e.episode,
        tags: e.tags,
        createdAt: e.createdAt,
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
  }, []);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    void fetchPage(0);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isInitialLoading) return;
    await fetchPage(endorsements.length);
  }, [fetchPage, endorsements.length, hasMore, isLoadingMore, isInitialLoading]);

  const runAction = useCallback(
    async (id: string, method: "POST" | "DELETE", failureMessage: string) => {
      if (pendingIds.has(id)) return;
      setPendingIds((prev) => new Set(prev).add(id));
      try {
        await clientFetcher(`/api/users/me/endorsement-requests/${encodeURIComponent(id)}`, {
          method,
          schema: endorsementRequestActionResponseSchema,
        });
        setEndorsements((prev) => prev.filter((e) => e.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : failureMessage);
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

  const approve = useCallback(
    (id: string) => runAction(id, "POST", "承認に失敗しました"),
    [runAction],
  );
  const reject = useCallback(
    (id: string) => runAction(id, "DELETE", "却下に失敗しました"),
    [runAction],
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
        approve,
        reject,
      })}
    </>
  );
};
