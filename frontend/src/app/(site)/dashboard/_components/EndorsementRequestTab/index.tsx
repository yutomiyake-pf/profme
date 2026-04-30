"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Tag } from "@/app/_components/Tag";
import styles from "./styles.module.css";

interface EndorsementRequest {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  relationship: string;
  episode: string;
  tags: string[];
  requestedAt: string;
}

const mockEndorsements: EndorsementRequest[] = [
  {
    id: "1",
    authorName: "佐藤 花子",
    relationship: "同期",
    episode:
      "プログラミングサークルで一緒にハッカソンに参加した際、チームのムードメーカーとして皆を鼓舞してくれました。技術力だけでなく、コミュニケーション力も素晴らしいです。",
    tags: ["リーダーシップ", "コミュニケーション力", "チームワーク"],
    requestedAt: "2024-01-15",
  },
  {
    id: "2",
    authorName: "鈴木 一郎",
    relationship: "先輩",
    episode:
      "インターン先で同じプロジェクトに参加。難しい課題にも粘り強く取り組み、最終的に素晴らしい成果を出しました。",
    tags: ["粘り強さ", "技術力", "学習意欲"],
    requestedAt: "2024-01-14",
  },
];

export const EndorsementRequestTab = () => {
  const [requests, setRequests] = useState(mockEndorsements);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (requests.length === 0) {
    return <p className={styles.empty}>承認待ちの評価はありません</p>;
  }

  return (
    <div className={styles.container}>
      {requests.map((request) => (
        <Card key={request.id} className={styles.endorsementCard} padding="lg" hoverable>
          <Link
            href={`/card/${request.id}`}
            className={styles.cardLink}
            aria-label={`${request.authorName}の名刺を見る`}
          />
          <div className={styles.endorsementHeader}>
            <Avatar name={request.authorName} src={request.authorAvatarUrl} size="md" />
            <div className={styles.endorsementMeta}>
              <p className={styles.authorName}>{request.authorName}</p>
              <p className={styles.relationship}>{request.relationship}</p>
            </div>
            <p className={styles.requestDate}>
              {new Date(request.requestedAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <p className={styles.episode}>{request.episode}</p>
          <div className={styles.tags}>
            {request.tags.map((tag) => (
              <Tag key={tag} variant="skill">
                {tag}
              </Tag>
            ))}
          </div>
          <div className={styles.endorsementActions}>
            <Button size="sm" onClick={() => handleApprove(request.id)}>
              承認して公開
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
              却下
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
