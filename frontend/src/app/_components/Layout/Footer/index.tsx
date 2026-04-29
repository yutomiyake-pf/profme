import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.copyright}>&copy; 2026 Profme. All rights reserved.</p>
      </div>
    </footer>
  );
};
