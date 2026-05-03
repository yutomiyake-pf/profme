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
import { type CardTheme, cardThemes } from "@/constants/cardTheme";
import type { MyCardProfile } from "../../_containers/PageContainer";
import { UpdateCardThemeContainer } from "../../_containers/UpdateCardThemeContainer";
import styles from "./styles.module.css";

interface Props {
  profile: MyCardProfile;
}

export const MyCardTab = ({ profile }: Props) => {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(profile.cardTheme);
  const [copied, setCopied] = useState(false);
  const qrDialogRef = useRef<DialogHandle>(null);

  const cardPagePath = `/card/${profile.uid}`;
  const cardUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${cardPagePath}`;

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

        <FullBusinessCard
          profile={{
            displayName: profile.displayName,
            university: profile.university,
            faculty: profile.faculty,
            grade: profile.grade,
            bio: profile.bio,
            gakuchika: profile.gakuchika,
            avatarUrl: profile.avatarUrl,
            cardTheme: selectedTheme,
            skills: profile.skills,
            hobbies: profile.hobbies,
            qualifications: profile.qualifications,
            snsLinks: profile.snsLinks,
            customLinks: profile.customLinks,
          }}
        />

        <UpdateCardThemeContainer>
          {({ isSubmitting, updateTheme }) => (
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
                    onClick={async () => {
                      const previous = selectedTheme;
                      // 楽観的に切り替え、API 失敗時のみ巻き戻す
                      setSelectedTheme(theme.id);
                      try {
                        await updateTheme(theme.id);
                      } catch {
                        setSelectedTheme(previous);
                      }
                    }}
                    disabled={isSubmitting}
                    aria-label={`${theme.label}テーマを選択`}
                    aria-pressed={selectedTheme === theme.id}
                  >
                    <span className={styles.themeColor} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </UpdateCardThemeContainer>

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
