import {
  IoPersonOutline,
  IoCardOutline,
  IoStarOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoDesktopOutline,
} from "react-icons/io5";
import styles from "./styles.module.css";
import { Card } from "@/app/_components/Card";

const features = [
  {
    icon: <IoPersonOutline size={24} />,
    title: "プロフィール登録",
    description: "大学・学部・スキル・趣味・推し活など、あなたの多面的な情報を一枚の名刺に。",
  },
  {
    icon: <IoCardOutline size={24} />,
    title: "デジタル名刺カード",
    description: "QRコードやURLでシンプルに共有。選べるカラーテーマで自分らしさを表現。",
  },
  {
    icon: <IoStarOutline size={24} />,
    title: "他己評価（Endorsement）",
    description: "仲間からの評価を名刺に表示。信頼性のある自己PRを実現。",
  },
  {
    icon: <IoPeopleOutline size={24} />,
    title: "フォロワー管理",
    description: "フォロー申請を承認制で管理。信頼できる人だけがあなたを評価できます。",
  },
  {
    icon: <IoShieldCheckmarkOutline size={24} />,
    title: "二段階承認",
    description: "評価は申請→承認の二段階制。オーナーが認めた評価だけが公開されます。",
  },
  {
    icon: <IoDesktopOutline size={24} />,
    title: "画像書き出し",
    description: "名刺カードをPNG・PDF形式でダウンロード。印刷やSNS投稿に最適。",
  },
];

export function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <div className={styles.header}>
          <h2 className={styles.title}>主な機能</h2>
          <p className={styles.subtitle}>
            大学生のさまざまなシーンに対応した機能で、 あなたの魅力を最大限に伝えます。
          </p>
        </div>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <Card key={index} className={styles.featureCard} hoverable>
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
