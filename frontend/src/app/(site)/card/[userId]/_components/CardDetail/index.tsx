"use client";

import { useState } from "react";
import { Button } from "@/app/_components/Button";
import { FullBusinessCard } from "@/app/_components/FullBusinessCard";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { EndorsementForm } from "../EndorsementForm";
import { EndorsementList } from "../EndorsementList";
import styles from "./styles.module.css";

type ViewerState = "owner" | "follower" | "pending" | "none" | "guest";

const mockProfile = {
  id: "user123",
  displayName: "山田 太郎",
  university: "東京大学",
  faculty: "工学部",
  grade: "3年",
  bio: "フロントエンドエンジニアを目指して日々学習中。React/Next.jsが好きです。趣味はコーヒーと読書。",
  gakuchika:
    "大学2年次からプログラミングサークルに所属し、チームリーダーとしてハッカソンに参加。Web アプリのフロントエンド設計を担当し、初心者メンバーへの技術指導も行いました。",
  avatarUrl: null,
  cardTheme: "navy" as const,
  skills: ["React", "TypeScript", "Next.js", "Node.js"],
  hobbies: ["コーヒー", "読書", "映画鑑賞"],
  qualifications: ["TOEIC 800", "応用情報技術者"],
  snsLinks: {
    twitter: "https://x.com/yamada_taro",
    instagram: "https://instagram.com/yamada_taro",
    github: "https://github.com/yamada-taro",
    linkedin: null,
  },
  customLinks: [
    { title: "ポートフォリオ", url: "https://yamada-taro.dev" },
    { title: "ブログ", url: "https://blog.yamada-taro.dev" },
    { title: "Qiita", url: "https://qiita.com/yamada_taro" },
  ],
};

const mockEndorsements = [
  {
    id: "1",
    authorName: "佐藤 花子",
    relationship: "同期",
    episode:
      "プログラミングサークルで一緒にハッカソンに参加した際、チームのムードメーカーとして皆を鼓舞してくれました。技術力だけでなく、コミュニケーション力も素晴らしいです。",
    tags: ["リーダーシップ", "コミュニケーション力", "チームワーク"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    authorName: "鈴木 一郎",
    relationship: "先輩",
    episode:
      "インターン先で同じプロジェクトに参加。難しい課題にも粘り強く取り組み、最終的に素晴らしい成果を出しました。後輩思いで、いつも丁寧に教えてくれます。",
    tags: ["粘り強さ", "技術力", "学習意欲"],
    createdAt: "2024-01-14",
  },
];

// TODO: derive from auth/follow state
const viewerState = "none" as ViewerState;

interface Props {
  userId: string;
}

export const CardDetail = ({ userId }: Props) => {
  const [followStatus, setFollowStatus] = useState<"none" | "pending">("none");

  const handleStickyAction = () => {
    if (viewerState === "follower") {
      setTimeout(() => {
        document.getElementById("endorsement-form")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (viewerState === "guest") {
      window.location.href = "/login";
    } else if (viewerState === "none") {
      setFollowStatus("pending");
    }
  };

  const stickyButtonText =
    viewerState === "follower"
      ? "評価を送る"
      : viewerState === "pending" || followStatus === "pending"
        ? "申請中..."
        : viewerState === "none" || viewerState === "guest"
          ? "フォローする"
          : null;

  const showStickyButton = viewerState !== "owner" && stickyButtonText !== null;
  const isStickyDisabled = viewerState === "pending" || followStatus === "pending";

  return (
    <PageLayout enableFooter={false} isLoggedIn={viewerState !== "guest"}>
      <div className={styles.container}>
        <FullBusinessCard profile={mockProfile} />

        {viewerState === "follower" && (
          <div id="endorsement-form">
            <EndorsementForm />
          </div>
        )}

        <section className={styles.endorsements}>
          <h2 className={styles.sectionTitle}>
            Endorsement
            <span className={styles.count}>{mockEndorsements.length}</span>
          </h2>
          <EndorsementList endorsements={mockEndorsements} />
        </section>

        {viewerState === "guest" && (
          <p className={styles.guestMessage}>
            評価を送るには
            <a href="/login" className={styles.loginLink}>
              ログイン
            </a>
            が必要です
          </p>
        )}
      </div>

      {showStickyButton && (
        <div className={styles.stickyButton}>
          <Button size="lg" fullWidth onClick={handleStickyAction} disabled={isStickyDisabled}>
            {stickyButtonText}
          </Button>
        </div>
      )}
    </PageLayout>
  );
};
