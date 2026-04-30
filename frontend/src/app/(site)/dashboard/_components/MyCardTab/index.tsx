"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";
import { FaPen } from "react-icons/fa";
import { IoCopyOutline, IoExpandOutline } from "react-icons/io5";
import { Card } from "@/app/_components/Card";
import { Dialog, DialogHandle } from "@/app/_components/Dialog";
import { FullBusinessCard } from "@/app/_components/FullBusinessCard";
import { CardTheme, cardThemes } from "@/constants/cardTheme";
import styles from "./styles.module.css";

const mockProfile = {
  displayName: "山田 太郎",
  university: "東京大学",
  faculty: "工学部",
  grade: "3年",
  bio: "フロントエンドエンジニアを目指して日々学習中。React/Next.jsが好きです。趣味はコーヒーと読書。",
  gakuchika:
    "大学2年次からプログラミングサークルに所属し、チームリーダーとしてハッカソンに参加。Web アプリのフロントエンド設計を担当し、初心者メンバーへの技術指導も行いました。",
  avatarUrl: null,
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
  ],
};

const cardUrl = "https://cardus.app/card/user123";
const cardPagePath = "/card/user123";

export const MyCardTab = () => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("navy");
  const [copied, setCopied] = useState(false);
  const qrDialogRef = useRef<DialogHandle>(null);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openQrDialog = () => qrDialogRef.current?.open();

  return (
    <div className={styles.container}>
      <Card padding="lg" className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h3 className={styles.previewTitle}>名刺プレビュー</h3>
          <div className={styles.previewActions}>
            <Link href="/profile/edit" className={styles.iconButton} aria-label="名刺を編集">
              <FaPen size={18} />
            </Link>
            <button
              type="button"
              className={styles.iconButton}
              onClick={handleCopyUrl}
              aria-label={copied ? "URLをコピーしました" : "URLをコピー"}
            >
              <IoCopyOutline size={18} />
            </button>
          </div>
        </div>

        <FullBusinessCard profile={{ ...mockProfile, cardTheme: selectedTheme }} />

        <div className={styles.themeSelector}>
          <p className={styles.themeSelectorLabel}>カラーテーマ</p>
          <div className={styles.themeOptions}>
            {cardThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={clsx(
                  styles.themeButton,
                  styles[theme.id],
                  selectedTheme === theme.id && styles.selected,
                )}
                onClick={() => setSelectedTheme(theme.id)}
                aria-label={`${theme.label}テーマを選択`}
                aria-pressed={selectedTheme === theme.id}
              >
                <span className={styles.themeColor} />
              </button>
            ))}
          </div>
        </div>

        <Link href={cardPagePath} className={styles.viewPageLink}>
          名刺ページを見る →
        </Link>
      </Card>

      <Card padding="lg" className={styles.shareCard}>
        <div className={styles.shareHeader}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={openQrDialog}
            aria-label="QRコードを拡大"
          >
            <IoExpandOutline size={18} />
          </button>
        </div>
        <div className={styles.qrCode}>
          <QRCodeSVG value={cardUrl} size={200} />
        </div>
      </Card>

      <Dialog ref={qrDialogRef} showCloseButton>
        <div className={styles.qrDialogContent}>
          <QRCodeSVG value={cardUrl} size={400} className={styles.qrDialogCode} />
        </div>
      </Dialog>
    </div>
  );
};
