"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  updateCardThemeResponseSchema,
  type UpdateCardThemeRequest,
} from "@/app/api/users/me/card-theme/type";
import type { CardTheme } from "@/constants/cardTheme";
import { clientFetcher } from "@/lib/fetcher/client";

export interface UpdateCardThemeRenderProps {
  isSubmitting: boolean;
  updateTheme: (theme: CardTheme) => Promise<void>;
}

interface Props {
  children: (props: UpdateCardThemeRenderProps) => ReactNode;
}

export const UpdateCardThemeContainer = ({ children }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTheme = async (theme: CardTheme) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const body: UpdateCardThemeRequest = { cardTheme: theme };
      await clientFetcher("/api/users/me/card-theme", {
        method: "PUT",
        schema: updateCardThemeResponseSchema,
        body,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "テーマの更新に失敗しました");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ isSubmitting, updateTheme })}</>;
};
