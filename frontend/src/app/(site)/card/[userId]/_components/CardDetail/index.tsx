"use client";

import Link from "next/link";
import { Button } from "@/app/_components/Button";
import { FullBusinessCard } from "@/app/_components/FullBusinessCard";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { LinkButton } from "@/app/_components/LinkButton";
import { EndorsementsContainer } from "../../_containers/EndorsementsContainer";
import { FollowContainer } from "../../_containers/FollowContainer";
import type { CardFollowRelationship, CardProfile } from "../../_containers/PageContainer";
import { EndorsementForm } from "../EndorsementForm";
import { EndorsementList } from "../EndorsementList";
import styles from "./styles.module.css";

interface Props {
  profile: CardProfile;
  isOwner: boolean;
  isLoggedIn: boolean;
  relationship: CardFollowRelationship | null;
}

const ENDORSEMENT_FORM_ID = "endorsement-form";

export const CardDetail = ({ profile, isOwner, isLoggedIn, relationship }: Props) => {
  // 自分のフォローが承認された (outgoing approved) か、
  // または相手からの申請を自分が承認した (incoming approved) ら follower 扱い
  const isFollower =
    relationship?.outgoing === "approved" || relationship?.incoming === "approved";

  return (
    <PageLayout enableFooter={false} isLoggedIn={isLoggedIn}>
      <div className={styles.container}>
        <FullBusinessCard
          profile={{
            displayName: profile.displayName,
            university: profile.university,
            faculty: profile.faculty,
            grade: profile.grade,
            bio: profile.bio,
            gakuchika: profile.gakuchika,
            avatarUrl: profile.avatarUrl,
            cardTheme: profile.cardTheme,
            skills: profile.skills,
            hobbies: profile.hobbies,
            qualifications: profile.qualifications,
            snsLinks: profile.snsLinks,
            customLinks: profile.customLinks,
          }}
        />

        {isFollower && (
          <div id={ENDORSEMENT_FORM_ID}>
            <EndorsementForm recipientUserId={profile.uid} />
          </div>
        )}

        <EndorsementsContainer userId={profile.uid}>
          {({ endorsements, isLoading, hasMore, error, loadMore }) => (
            <section className={styles.endorsements}>
              <h2 className={styles.sectionTitle}>
                Endorsement
                <span className={styles.count}>{endorsements.length}</span>
              </h2>
              <EndorsementList endorsements={endorsements} />
              {error && <p className={styles.errorMessage}>{error}</p>}
              {hasMore && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadMore}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  もっとみる
                </Button>
              )}
              {!hasMore && endorsements.length > 0 && (
                <p className={styles.endMessage}>これ以上の評価はありません</p>
              )}
            </section>
          )}
        </EndorsementsContainer>

        {!isOwner && !isLoggedIn && (
          <p className={styles.guestMessage}>
            評価を送るには
            <Link href="/login" className={styles.loginLink}>
              ログイン
            </Link>
            が必要です
          </p>
        )}
      </div>

      {isOwner ? (
        <div className={styles.stickyButton}>
          <LinkButton href="/profile/edit" size="lg" fullWidth>
            プロフィールを編集
          </LinkButton>
        </div>
      ) : !isLoggedIn ? (
        <div className={styles.stickyButton}>
          <LinkButton href="/login" size="lg" fullWidth>
            ログイン
          </LinkButton>
        </div>
      ) : !relationship ? null : isFollower ? (
        <div className={styles.stickyButton}>
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              document
                .getElementById(ENDORSEMENT_FORM_ID)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            評価を送る
          </Button>
        </div>
      ) : relationship.outgoing === "pending" ? (
        <div className={styles.stickyButton}>
          <Button size="lg" fullWidth disabled>
            申請中...
          </Button>
        </div>
      ) : (
        <FollowContainer userId={profile.uid}>
          {({ isSubmitting, submit }) => (
            <div className={styles.stickyButton}>
              <Button size="lg" fullWidth onClick={submit} isLoading={isSubmitting}>
                {relationship.incoming === "pending" ? "承認する" : "フォローする"}
              </Button>
            </div>
          )}
        </FollowContainer>
      )}
    </PageLayout>
  );
};
