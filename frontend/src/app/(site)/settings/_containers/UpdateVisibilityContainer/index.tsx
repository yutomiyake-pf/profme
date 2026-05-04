"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  type UpdateFieldVisibilityRequest,
  updateFieldVisibilityResponseSchema,
} from "@/app/api/users/me/field-visibility/type";
import { clientFetcher } from "@/lib/fetcher/client";
import type { FieldVisibility } from "../PageContainer";

export interface UpdateVisibilityRenderProps {
  isSubmitting: boolean;
  /** 1 つだけ変える場合も full state (3 フラグ全部) を送る */
  updateVisibility: (next: FieldVisibility) => Promise<void>;
}

interface Props {
  children: (props: UpdateVisibilityRenderProps) => ReactNode;
}

export const UpdateVisibilityContainer = ({ children }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVisibility = async (next: FieldVisibility) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const body: UpdateFieldVisibilityRequest = next;
      await clientFetcher("/api/users/me/field-visibility", {
        method: "PUT",
        schema: updateFieldVisibilityResponseSchema,
        body,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "公開設定の更新に失敗しました");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ isSubmitting, updateVisibility })}</>;
};
