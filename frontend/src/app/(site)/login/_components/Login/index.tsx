import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { SITE_NAME } from "@/constants/site";
import { LoginForm } from "../LoginForm";
import styles from "./styles.module.css";
import Link from "next/link";

export const Login = () => {
  return (
    <PageLayout enableHeader={false}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 className={styles.logoText}>{SITE_NAME}</h1>
            <p className={styles.tagline}>大学生のためのデジタル名刺</p>
          </header>
          <LoginForm />
          <p className={styles.terms}>
            ログインすることで、
            <Link target="_blank" href="/terms" className={styles.link}>
              利用規約
            </Link>
            および
            <Link target="_blank" href="/privacy-policy" className={styles.link}>
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </PageLayout>
  );
};
