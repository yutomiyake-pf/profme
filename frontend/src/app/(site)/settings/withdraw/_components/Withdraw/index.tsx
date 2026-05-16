"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { deleteMeResponseSchema } from "@/app/api/users/me/type";
import { clientFetcher } from "@/lib/fetcher/client";
import { auth } from "@/lib/firebase/client";
import styles from "./styles.module.css";

export const Withdraw = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (isSubmitting) return;
    if (!confirm("本当に退会しますか？\nこの操作は取り消せません。")) return;
    setIsSubmitting(true);
    try {
      await clientFetcher("/api/users/me", {
        method: "DELETE",
        schema: deleteMeResponseSchema,
      });
      // API 側で session cookie は破棄済 + Firebase Auth ユーザも削除済。
      // client SDK の signOut で AuthProvider の state も同期させる。
      await signOut(auth);
      toast.success("退会が完了しました");
      window.location.href = "/";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "退会に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout isLoggedIn>
      <div className={styles.container}>
        <h1 className={styles.title}>退会</h1>

        <Card padding="lg" className={styles.card}>
          <p className={styles.lead}>本当に退会しますか?</p>
          <p className={styles.note}>
            退会するとアカウントとプロフィール、フォロー関係、評価
            (Endorsement)、ポートフォリオリンクを含むすべてのデータが削除されます。
            この操作は取り消せません。
          </p>
        </Card>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            onClick={() => router.push("/dashboard")}
          >
            キャンセル
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleWithdraw}
            isLoading={isSubmitting}
          >
            退会する
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};
