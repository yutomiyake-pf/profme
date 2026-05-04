import "server-only";

import type { ReactNode } from "react";
import { getMeResponseSchema } from "@/app/api/users/me/type";
import { serverFetcher } from "@/lib/fetcher/server";

export interface FieldVisibility {
  universityVisible: boolean;
  snsVisible: boolean;
  endorsementsVisible: boolean;
  customLinksVisible: boolean;
}

interface Props {
  children: (props: { initialVisibility: FieldVisibility }) => ReactNode;
}

export const PageContainer = async ({ children }: Props) => {
  const profile = await serverFetcher("/api/users/me", {
    schema: getMeResponseSchema,
    cache: "no-store",
  });
  return (
    <>
      {children({
        initialVisibility: {
          universityVisible: profile.universityVisible,
          snsVisible: profile.snsVisible,
          endorsementsVisible: profile.endorsementsVisible,
          customLinksVisible: profile.customLinksVisible,
        },
      })}
    </>
  );
};
