import { FullBusinessCard } from "@/app/_components/FullBusinessCard";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { LinkButton } from "@/app/_components/LinkButton";
import { EndorsementList } from "@/app/(site)/card/[userId]/_components/EndorsementList";
import type { Endorsement } from "@/app/(site)/card/[userId]/_containers/EndorsementsContainer";
import styles from "./styles.module.css";

// 全て固定モック。サンプル閲覧者は API を叩かないので server component で OK。
const SAMPLE_PROFILE = {
  displayName: "山田 太郎",
  university: "東京大学",
  faculty: "工学部",
  grade: "3年",
  bio: "フロントエンドエンジニアを目指して日々学習中。React/Next.js が好きです。趣味はコーヒーと読書。",
  gakuchika:
    "大学2年次からプログラミングサークルに所属し、チームリーダーとしてハッカソンに参加。Web アプリのフロントエンド設計を担当し、初心者メンバーへの技術指導も行いました。",
  avatarUrl: null,
  cardTheme: "navy" as const,
  skills: ["React", "TypeScript", "Next.js", "Node.js"],
  hobbies: ["コーヒー", "読書", "映画鑑賞"],
  qualifications: ["TOEIC 800", "応用情報技術者"],
};

const SAMPLE_ENDORSEMENTS: Endorsement[] = [
  {
    id: "sample-1",
    authorName: "佐藤 花子",
    authorAvatarUrl: null,
    relationship: "同期",
    episode:
      "プログラミングサークルで一緒にハッカソンに参加した際、チームのムードメーカーとして皆を鼓舞してくれました。技術力だけでなく、コミュニケーション力も素晴らしいです。",
    tags: ["リーダーシップ", "コミュニケーション力", "チームワーク"],
    approvedAt: "2026-04-20T00:00:00Z",
  },
  {
    id: "sample-2",
    authorName: "鈴木 一郎",
    authorAvatarUrl: null,
    relationship: "先輩",
    episode:
      "インターン先で同じプロジェクトに参加。難しい課題にも粘り強く取り組み、最終的に素晴らしい成果を出しました。後輩への教え方も丁寧で頼りになる存在です。",
    tags: ["粘り強さ", "技術力", "学習意欲"],
    approvedAt: "2026-03-12T00:00:00Z",
  },
  {
    id: "sample-3",
    authorName: "田中 美咲",
    authorAvatarUrl: null,
    relationship: "後輩",
    episode:
      "勉強会で初めて React を教えてもらいました。複雑な概念も丁寧に説明してくれて、その後のプロジェクトでも何度も助けていただきました。",
    tags: ["頼れる存在", "コミュニケーション力"],
    approvedAt: "2026-02-05T00:00:00Z",
  },
];

interface Props {
  isLoggedIn: boolean;
}

export const SampleCard = ({ isLoggedIn }: Props) => {
  return (
    <PageLayout enableFooter={false} isLoggedIn={isLoggedIn}>
      <div className={styles.container}>
        <p className={styles.banner}>これはサンプルです。実際のデータではありません。</p>

        <FullBusinessCard profile={SAMPLE_PROFILE} />

        <section className={styles.endorsements}>
          <h2 className={styles.sectionTitle}>
            Endorsement
            <span className={styles.count}>{SAMPLE_ENDORSEMENTS.length}</span>
          </h2>
          <EndorsementList endorsements={SAMPLE_ENDORSEMENTS} />
        </section>
      </div>

      <div className={styles.stickyButton}>
        <LinkButton href="/login" size="lg" fullWidth>
          自分の名刺を作る
        </LinkButton>
      </div>
    </PageLayout>
  );
};
