import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";

export const Settings = () => {
  return (
    <PageLayout enableFooter={false} isLoggedIn>
      <div className={styles.container}>
        <h1 className={styles.title}>設定</h1>
        <p className={styles.placeholder}>設定項目は準備中です。</p>
      </div>
    </PageLayout>
  );
};
