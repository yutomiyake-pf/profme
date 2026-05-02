"use client";

import { type ReactNode } from "react";
import { sessionResponseSchema } from "@/app/api/auth/session/type";
import { clientFetcher } from "@/lib/fetcher/client";

export interface SessionRenderProps {
  createSession: (input: { idToken: string; displayName?: string }) => Promise<void>;
  deleteSession: () => Promise<void>;
}

interface Props {
  children: (props: SessionRenderProps) => ReactNode;
}

/**
 * /api/auth/session の発行・破棄責務。
 * Cookie 操作は API Route 側で行うのでここでは fetch するだけ。
 */
export const SessionContainer = ({ children }: Props) => {
  const createSession = async (input: { idToken: string; displayName?: string }) => {
    await clientFetcher("/api/auth/session", {
      schema: sessionResponseSchema,
      method: "POST",
      body: input,
    });
  };

  const deleteSession = async () => {
    await clientFetcher("/api/auth/session", {
      schema: sessionResponseSchema,
      method: "DELETE",
      throwErr: false,
    });
  };

  return <>{children({ createSession, deleteSession })}</>;
};
