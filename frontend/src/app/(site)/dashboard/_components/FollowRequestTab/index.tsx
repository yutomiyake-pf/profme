"use client";

import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Spinner } from "@/app/_components/Spinner";
import type { FollowRequestsRenderProps } from "../../_containers/FollowRequestsContainer";
import styles from "./styles.module.css";

type Props = FollowRequestsRenderProps;

export const FollowRequestTab = ({
  requests,
  isInitialLoading,
  isLoadingMore,
  hasMore,
  error,
  pendingIds,
  loadMore,
  approve,
  reject,
}: Props) => {
  if (isInitialLoading) {
    return <Spinner />;
  }

  if (requests.length === 0) {
    return <p className={styles.empty}>フォロー申請はありません</p>;
  }

  return (
    <div className={styles.container}>
      {requests.map(({ follower, requestedAt }) => {
        const isPending = pendingIds.has(follower.uid);
        return (
          <Card key={follower.uid} className={styles.requestCard} padding="md" hoverable>
            <Link
              href={`/card/${follower.uid}`}
              className={styles.cardLink}
              aria-label={`${follower.displayName}の名刺を見る`}
            />
            <div className={styles.requestInfo}>
              <Avatar name={follower.displayName} src={follower.avatarUrl} size="md" />
              <div className={styles.requestDetails}>
                <p className={styles.requestName}>{follower.displayName}</p>
                {follower.university && (
                  <p className={styles.requestUniversity}>{follower.university}</p>
                )}
                <p className={styles.requestDate}>
                  {new Date(requestedAt).toLocaleDateString("ja-JP")} に申請
                </p>
              </div>
            </div>
            <div className={styles.requestActions}>
              <Button
                size="sm"
                onClick={() => approve(follower.uid)}
                isLoading={isPending}
                disabled={isPending}
              >
                承認
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => reject(follower.uid)}
                disabled={isPending}
              >
                却下
              </Button>
            </div>
          </Card>
        );
      })}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {hasMore && (
        <Button
          type="button"
          variant="primary"
          onClick={loadMore}
          isLoading={isLoadingMore}
          disabled={isLoadingMore}
        >
          もっとみる
        </Button>
      )}
    </div>
  );
};
