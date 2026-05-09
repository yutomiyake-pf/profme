"use client";

import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Spinner } from "@/app/_components/Spinner";
import { Tag } from "@/app/_components/Tag";
import type { MyEndorsementsRenderProps } from "../../_containers/MyEndorsementsContainer";
import styles from "./styles.module.css";

type Props = MyEndorsementsRenderProps;

export const MyEndorsementTab = ({
  endorsements,
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

  if (endorsements.length === 0) {
    return <p className={styles.empty}>受け取った評価はありません</p>;
  }

  return (
    <div className={styles.container}>
      {endorsements.map((endorsement) => {
        const isPending = pendingIds.has(endorsement.id);
        return (
          <Card key={endorsement.id} className={styles.endorsementCard} padding="lg" hoverable>
            <Link
              href={`/card/${endorsement.author.uid}`}
              className={styles.cardLink}
              aria-label={`${endorsement.author.displayName}の名刺を見る`}
            />
            <div className={styles.endorsementHeader}>
              <Avatar
                name={endorsement.author.displayName}
                src={endorsement.author.avatarUrl}
                size="md"
              />
              <div className={styles.endorsementMeta}>
                <p className={styles.authorName}>{endorsement.author.displayName}</p>
                {endorsement.relationship && (
                  <p className={styles.relationship}>{endorsement.relationship}</p>
                )}
              </div>
              {endorsement.approvedAt && (
                <p className={styles.requestDate}>
                  {new Date(endorsement.approvedAt).toLocaleDateString("ja-JP")}
                </p>
              )}
            </div>
            <p className={styles.episode}>{endorsement.episode}</p>
            <div className={styles.tags}>
              {endorsement.tags.map((tag) => (
                <Tag key={tag} variant="skill">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className={styles.endorsementActions}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove(endorsement.id)}
                isLoading={isPending}
                disabled={isPending}
              >
                削除
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
