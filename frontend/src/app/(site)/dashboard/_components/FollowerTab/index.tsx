"use client";

import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Spinner } from "@/app/_components/Spinner";
import type { FollowersRenderProps } from "../../_containers/FollowersContainer";
import styles from "./styles.module.css";

type Props = FollowersRenderProps;

export const FollowerTab = ({
  followers,
  total,
  isInitialLoading,
  isLoadingMore,
  hasMore,
  error,
  pendingIds,
  loadMore,
  remove,
}: Props) => {
  if (isInitialLoading) {
    return <Spinner />;
  }

  if (followers.length === 0) {
    return <p className={styles.empty}>フォロワーはまだいません</p>;
  }

  return (
    <div className={styles.container}>
      <p className={styles.count}>{total}人のフォロワー</p>
      <div className={styles.list}>
        {followers.map(({ follower, approvedAt }) => {
          const isPending = pendingIds.has(follower.uid);
          return (
            <Card key={follower.uid} className={styles.followerCard} padding="md" hoverable>
              <Link
                href={`/card/${follower.uid}`}
                className={styles.cardLink}
                aria-label={`${follower.displayName}の名刺を見る`}
              />
              <Avatar name={follower.displayName} src={follower.avatarUrl} size="md" />
              <div className={styles.followerInfo}>
                <p className={styles.followerName}>{follower.displayName}</p>
                {follower.university && (
                  <p className={styles.followerUniversity}>{follower.university}</p>
                )}
              </div>
              <div className={styles.followerActions}>
                {approvedAt && (
                  <p className={styles.approvedDate}>
                    {new Date(approvedAt).toLocaleDateString("ja-JP")}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(follower.uid)}
                  className={styles.removeButton}
                  isLoading={isPending}
                  disabled={isPending}
                >
                  解除
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
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
