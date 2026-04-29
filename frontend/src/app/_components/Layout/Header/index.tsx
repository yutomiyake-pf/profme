import Link from "next/link";
import styles from "./styles.module.css";

type Props = {
  isLoggedIn?: boolean;
};

export const Header = ({ isLoggedIn = false }: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Profme</span>
        </Link>
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.navLink}>
              ダッシュボード
            </Link>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
