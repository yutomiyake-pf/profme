"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  IoChevronForward,
  IoCreateOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { Card } from "@/app/_components/Card";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { auth } from "@/lib/firebase/client";
import styles from "./styles.module.css";
import { toast } from "sonner";

interface ItemProps {
  icon: ReactNode;
  label: string;
}

// Link 用と button (= ログアウト等の action) 用で同じ見た目を保つラッパ
const itemBody = ({ icon, label }: ItemProps) => (
  <>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.label}>{label}</span>
    <IoChevronForward size={16} className={styles.chevron} />
  </>
);

export const Settings = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // AuthProvider の onIdTokenChanged が user=null を検知 → /api/auth/session DELETE
    // が走り、session cookie も自動で破棄される。ここでは client SDK のサインアウトのみ。
    await signOut(auth);
    toast.success("ログアウトしました");
    router.replace("/login");
  };

  return (
    <PageLayout isLoggedIn>
      <div className={styles.container}>
        <h1 className={styles.title}>設定</h1>
        <Card padding="none" className={styles.list}>
          <Link href="/dashboard" className={styles.item}>
            {itemBody({ icon: <IoGridOutline size={20} />, label: "ダッシュボード" })}
          </Link>
          <Link href="/profile/edit" className={styles.item}>
            {itemBody({ icon: <IoCreateOutline size={20} />, label: "名刺情報編集" })}
          </Link>
          <button type="button" onClick={handleLogout} className={styles.item}>
            {itemBody({ icon: <IoLogOutOutline size={20} />, label: "ログアウト" })}
          </button>
          <Link href="/terms" className={styles.item}>
            {itemBody({ icon: <IoDocumentTextOutline size={20} />, label: "利用規約" })}
          </Link>
          <Link href="/privacy" className={styles.item}>
            {itemBody({
              icon: <IoShieldCheckmarkOutline size={20} />,
              label: "プライバシーポリシー",
            })}
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
};
