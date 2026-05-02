"use client";

import { type ReactNode } from "react";
import { checkPhoneResponseSchema } from "@/app/api/auth/check-phone/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface PhoneCheckRenderProps {
  checkPhone: (phoneE164: string) => Promise<boolean>;
}

interface Props {
  children: (props: PhoneCheckRenderProps) => ReactNode;
}

/**
 * 電話番号の登録有無を /api/auth/check-phone に問い合わせるだけの責務。
 */
export const PhoneCheckContainer = ({ children }: Props) => {
  const checkPhone = async (phoneE164: string) => {
    const data = await clientFetcher("/api/auth/check-phone", {
      schema: checkPhoneResponseSchema,
      method: "POST",
      body: { phoneNumber: phoneE164 },
    });
    return data.exists;
  };

  return <>{children({ checkPhone })}</>;
};
