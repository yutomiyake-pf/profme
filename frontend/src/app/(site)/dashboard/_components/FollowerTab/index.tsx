"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import styles from "./styles.module.css";

interface Follower {
  id: string;
  name: string;
  avatarUrl?: string;
  university: string;
  approvedAt: string;
}

const initialFollowers: Follower[] = [
  { id: "1", name: "高橋 健太", university: "京都大学", approvedAt: "2024-01-10" },
  { id: "2", name: "渡辺 真由", university: "大阪大学", approvedAt: "2024-01-08" },
  { id: "3", name: "伊藤 大輔", university: "東京工業大学", approvedAt: "2024-01-05" },
  { id: "4", name: "山本 桜", university: "九州大学", approvedAt: "2024-01-03" },
];

export const FollowerTab = () => {
  const [followers, setFollowers] = useState<Follower[]>(initialFollowers);

  const handleRemove = (id: string) => {
    setFollowers((prev) => prev.filter((f) => f.id !== id));
  };

  if (followers.length === 0) {
    return <p className={styles.empty}>フォロワーはまだいません</p>;
  }

  return (
    <div className={styles.container}>
      <p className={styles.count}>{followers.length}人のフォロワー</p>
      <div className={styles.list}>
        {followers.map((follower) => (
          <Card key={follower.id} className={styles.followerCard} padding="md" hoverable>
            <Link
              href={`/card/${follower.id}`}
              className={styles.cardLink}
              aria-label={`${follower.name}の名刺を見る`}
            />
            <Avatar name={follower.name} src={follower.avatarUrl} size="md" />
            <div className={styles.followerInfo}>
              <p className={styles.followerName}>{follower.name}</p>
              <p className={styles.followerUniversity}>{follower.university}</p>
            </div>
            <div className={styles.followerActions}>
              <p className={styles.approvedDate}>
                {new Date(follower.approvedAt).toLocaleDateString("ja-JP")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(follower.id)}
                className={styles.removeButton}
              >
                解除
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
