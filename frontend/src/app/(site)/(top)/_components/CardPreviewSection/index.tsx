import { BusinessCardPreview } from "@/app/_components/BuisinessCardPreview";
import styles from "./styles.module.css";

const themes = [
  { id: "navy", label: "Navy" },
  { id: "rose", label: "Rose" },
  { id: "forest", label: "Forest" },
  { id: "gold", label: "Gold" },
  { id: "mono", label: "Mono" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "lavender", label: "Lavender" },
  { id: "mint", label: "Mint" },
  { id: "charcoal", label: "Charcoal" },
] as const;

const sampleProfile = {
  displayName: "山田 太郎",
  university: "東京大学",
  faculty: "工学部",
  grade: "3年",
  bio: "フロントエンドエンジニアを目指して日々学習中。React/Next.jsが好きです。趣味はコーヒーと読書。",
  skills: ["React", "TypeScript", "Next.js"],
  hobbies: ["コーヒー", "読書"],
  fandoms: ["King Gnu"],
};

export const CardPreviewSection = () => {
  return (
    <section className={styles.preview}>
      <div className={styles.previewInner}>
        <div className={styles.header}>
          <h2 className={styles.title}>選べるカラーテーマ</h2>
          <p className={styles.subtitle}>シーンや好みに合わせて、10種類のテーマから選べます。</p>
        </div>
        <div className={styles.cards}>
          {themes.map((theme) => (
            <div key={theme.id} className={styles.cardWrapper}>
              <BusinessCardPreview theme={theme.id} profile={sampleProfile} compact />
              <p className={styles.themeLabel}>{theme.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
