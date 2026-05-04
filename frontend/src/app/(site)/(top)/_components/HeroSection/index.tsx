import Link from "next/link";
import styles from "./styles.module.css";
import { Button } from "@/app/_components/Button";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.badge}>大学生のためのデジタル名刺</p>
        <h1 className={styles.title}>
          あなたの多面的な姿を、
          <br />
          <span className={styles.accent}>信頼できる仲間の言葉</span>で証明する。
        </h1>
        <p className={styles.description}>
          就活・サークル・インターン・趣味のあらゆる場面で使える、
          他己評価（Endorsement）付きのデジタル名刺プラットフォーム。
        </p>
        <div className={styles.actions}>
          <Link href="/login">
            <Button size="lg">無料で名刺を作る</Button>
          </Link>
          <Link href="/dashboard/sample">
            <Button variant="outline" size="lg">
              サンプルを見る
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
