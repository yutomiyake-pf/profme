"use client";

import { type ReactNode, useState } from "react";
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
import { toast } from "sonner";
import { Card } from "@/app/_components/Card";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { auth } from "@/lib/firebase/client";
import type { FieldVisibility } from "../../_containers/PageContainer";
import { UpdateVisibilityContainer } from "../../_containers/UpdateVisibilityContainer";
import styles from "./styles.module.css";

interface ItemProps {
  icon: ReactNode;
  label: string;
}

// Link 用と button 用で同じ見た目を保つラッパ
const itemBody = ({ icon, label }: ItemProps) => (
  <>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.label}>{label}</span>
    <IoChevronForward size={16} className={styles.chevron} />
  </>
);

const VISIBILITY_FIELDS: { key: keyof FieldVisibility; label: string }[] = [
  { key: "universityVisible", label: "大学情報" },
  { key: "snsVisible", label: "SNS" },
  { key: "endorsementsVisible", label: "Endorsement" },
  { key: "customLinksVisible", label: "ポートフォリオ" },
];

interface Props {
  initialVisibility: FieldVisibility;
}

export const Settings = ({ initialVisibility }: Props) => {
  const router = useRouter();
  const [visibility, setVisibility] = useState<FieldVisibility>(initialVisibility);

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

        <UpdateVisibilityContainer>
          {({ isSubmitting, updateVisibility }) => (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>公開設定</h2>
              <Card padding="none" className={styles.list}>
                {VISIBILITY_FIELDS.map(({ key, label }) => (
                  <div key={key} className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>{label}</span>
                    <div className={styles.fieldRadios}>
                      {(
                        [
                          { v: true, label: "公開" },
                          { v: false, label: "非公開" },
                        ] as const
                      ).map(({ v, label: vLabel }) => (
                        <label key={String(v)} className={styles.radioOption}>
                          <input
                            type="radio"
                            name={key}
                            checked={visibility[key] === v}
                            disabled={isSubmitting}
                            onChange={async () => {
                              const previous = visibility;
                              const next: FieldVisibility = { ...visibility, [key]: v };
                              // 楽観的に切り替え、API 失敗時のみ巻き戻す
                              setVisibility(next);
                              try {
                                await updateVisibility(next);
                              } catch {
                                setVisibility(previous);
                              }
                            }}
                            className={styles.radio}
                          />
                          <span>{vLabel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </section>
          )}
        </UpdateVisibilityContainer>

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
          <Link href="/privacy-policy" className={styles.item}>
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
