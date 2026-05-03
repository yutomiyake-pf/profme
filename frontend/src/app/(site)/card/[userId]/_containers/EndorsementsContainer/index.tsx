"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  ENDORSEMENT_PAGE_SIZE,
  endorsementsResponseSchema,
} from "@/app/api/users/[userId]/endorsements/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface Endorsement {
  id: string;
  authorName: string;
  authorAvatarUrl: string | null;
  relationship: string | null;
  episode: string;
  tags: string[];
  approvedAt: string | null;
}

export interface EndorsementsRenderProps {
  endorsements: Endorsement[];
  /** DB 上の総件数 (バッジに使う。表示済み件数 endorsements.length とは異なる) */
  total: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
}

interface Props {
  userId: string;
  children: (props: EndorsementsRenderProps) => ReactNode;
}

export const EndorsementsContainer = ({ userId, children }: Props) => {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);
    try {
      const offset = endorsements.length;
      const data = await clientFetcher(
        `/api/users/${userId}/endorsements?limit=${ENDORSEMENT_PAGE_SIZE}&offset=${offset}`,
        { schema: endorsementsResponseSchema },
      );
      const next: Endorsement[] = data.endorsements.map((e) => ({
        id: e.id,
        authorName: e.author.displayName,
        authorAvatarUrl: e.author.avatarUrl,
        relationship: e.relationship,
        episode: e.episode,
        tags: e.tags,
        approvedAt: e.approvedAt,
      }));
      setEndorsements((prev) => [...prev, ...next]);
      setTotal(data.total);
      setHasMore(offset + next.length < data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, userId, endorsements.length]);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    void loadMore();
  }, [loadMore]);

  return <>{children({ endorsements, total, isLoading, hasMore, error, loadMore })}</>;
};
