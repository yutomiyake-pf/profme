"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { followRelationshipSchema } from "@/app/api/users/[userId]/follow/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface FollowRenderProps {
  isSubmitting: boolean;
  submit: () => Promise<void>;
}

interface Props {
  userId: string;
  children: (props: FollowRenderProps) => ReactNode;
}

export const FollowContainer = ({ userId, children }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await clientFetcher(`/api/users/${userId}/follow`, {
        method: "POST",
        schema: followRelationshipSchema,
      });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "申請に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ isSubmitting, submit })}</>;
};
