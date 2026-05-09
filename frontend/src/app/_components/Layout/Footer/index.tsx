import Link from "next/link";
import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.credit}>produced by Astra Tech</p>
        <p className={styles.copyright}>&copy; 2026 Profme. All rights reserved.</p>
        <nav className={styles.links}>
          <Link href="/terms" className={styles.link}>
            利用規約
          </Link>
          <span className={styles.separator} aria-hidden="true">
            ・
          </span>
          <Link href="/privacy-policy" className={styles.link}>
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </footer>
  );
};
