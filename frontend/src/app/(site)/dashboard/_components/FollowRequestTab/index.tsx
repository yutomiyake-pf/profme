"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/app/_components/Avatar";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import styles from "./styles.module.css";

interface FollowRequest {
  id: string;
  name: string;
  avatarUrl?: string;
  university: string;
  requestedAt: string;
}

const mockRequests: FollowRequest[] = [
  { id: "1", name: "佐藤 花子", university: "早稲田大学", requestedAt: "2024-01-15" },
  { id: "2", name: "鈴木 一郎", university: "慶應義塾大学", requestedAt: "2024-01-14" },
  { id: "3", name: "田中 美咲", university: "東京大学", requestedAt: "2024-01-13" },
];

export const FollowRequestTab = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (requests.length === 0) {
    return <p className={styles.empty}>フォロー申請はありません</p>;
  }

  return (
    <div className={styles.container}>
      {requests.map((request) => (
        <Card key={request.id} className={styles.requestCard} padding="md" hoverable>
          <Link
            href={`/card/${request.id}`}
            className={styles.cardLink}
            aria-label={`${request.name}の名刺を見る`}
          />
          <div className={styles.requestInfo}>
            <Avatar name={request.name} src={request.avatarUrl} size="md" />
            <div className={styles.requestDetails}>
              <p className={styles.requestName}>{request.name}</p>
              <p className={styles.requestUniversity}>{request.university}</p>
              <p className={styles.requestDate}>
                {new Date(request.requestedAt).toLocaleDateString("ja-JP")} に申請
              </p>
            </div>
          </div>
          <div className={styles.requestActions}>
            <Button size="sm" onClick={() => handleApprove(request.id)}>
              承認
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
