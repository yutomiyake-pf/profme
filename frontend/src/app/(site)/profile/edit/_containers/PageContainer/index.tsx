import "server-only";

import type { ReactNode } from "react";
import { type GetMeResponse, getMeResponseSchema } from "@/app/api/users/me/type";
import { serverFetcher } from "@/lib/fetcher/server";
import type { ProfileFormValues } from "../../_components/ProfileEditForm/schema";

interface Props {
  children: (initialValues: ProfileFormValues) => ReactNode;
}

/**
 * プロフィール編集ページのデータ取得層 (server component)。
 * /api/users/me を叩いて取得した初期値を render-prop で children に渡す。
 *
 * children は server から server への渡しで、クライアント境界を跨がないため関数で OK。
 *
 * ```tsx
 * <PageContainer>
 *   {(initialValues) => <ProfileEdit initialValues={initialValues} />}
 * </PageContainer>
 * ```
 */
export const PageContainer = async ({ children }: Props) => {
  const profile = await serverFetcher("/api/users/me", {
    schema: getMeResponseSchema,
    cache: "no-store",
  });
  return <>{children(toFormValues(profile))}</>;
};

// API レスポンス (null 許容) → フォーム値 (空文字) への変換
const toFormValues = (profile: GetMeResponse): ProfileFormValues => ({
  displayName: profile.displayName,
  university: profile.university ?? "",
  faculty: profile.faculty ?? "",
  grade: profile.grade ?? "",
  bio: profile.bio ?? "",
  gakuchika: profile.gakuchika ?? "",
  avatarUrl: profile.avatarUrl ?? "",
  twitter: profile.twitter ?? "",
  instagram: profile.instagram ?? "",
  github: profile.github ?? "",
  linkedin: profile.linkedin ?? "",
  customLinks: profile.customLinks
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(({ title, url }) => ({ title, url })),
  skills: profile.skills,
  hobbies: profile.hobbies,
  qualifications: profile.qualifications,
});
