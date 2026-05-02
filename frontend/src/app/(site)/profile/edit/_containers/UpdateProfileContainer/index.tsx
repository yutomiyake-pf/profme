"use client";

import { type ReactNode } from "react";
import { type UpdateMeRequest, updateMeResponseSchema } from "@/app/api/users/me/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface UpdateProfileRenderProps {
  updateProfile: (input: UpdateMeRequest) => Promise<void>;
}

interface Props {
  children: (props: UpdateProfileRenderProps) => ReactNode;
}

/**
 * プロフィール編集フォームの送信を /api/users/me PUT に投げるだけの責務。
 */
export const UpdateProfileContainer = ({ children }: Props) => {
  const updateProfile = async (input: UpdateMeRequest) => {
    await clientFetcher("/api/users/me", {
      schema: updateMeResponseSchema,
      method: "PUT",
      body: input,
    });
  };

  return <>{children({ updateProfile })}</>;
};
