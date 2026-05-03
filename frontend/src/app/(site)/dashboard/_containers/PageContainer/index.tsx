import "server-only";

import type { ReactNode } from "react";
import { type GetMeResponse, getMeResponseSchema } from "@/app/api/users/me/type";
import { type CardTheme, cardThemes } from "@/constants/cardTheme";
import { serverFetcher } from "@/lib/fetcher/server";

const validThemeIds = new Set<string>(cardThemes.map((t) => t.id));
const toCardTheme = (raw: string): CardTheme =>
  validThemeIds.has(raw) ? (raw as CardTheme) : "navy";

export interface MyCardProfile {
  uid: string;
  displayName: string;
  university?: string;
  faculty?: string;
  grade?: string;
  bio?: string;
  gakuchika?: string;
  avatarUrl: string | null;
  cardTheme: CardTheme;
  skills: string[];
  hobbies: string[];
  qualifications: string[];
  snsLinks: {
    twitter: string | null;
    instagram: string | null;
    github: string | null;
    linkedin: string | null;
  };
  customLinks: { title: string; url: string }[];
}

interface Props {
  children: (props: { myCard: MyCardProfile }) => ReactNode;
}

export const PageContainer = async ({ children }: Props) => {
  const raw = await serverFetcher("/api/users/me", {
    schema: getMeResponseSchema,
    cache: "no-store",
  });

  const myCard: MyCardProfile = {
    uid: raw.uid,
    displayName: raw.displayName,
    university: raw.university ?? undefined,
    faculty: raw.faculty ?? undefined,
    grade: raw.grade ?? undefined,
    bio: raw.bio ?? undefined,
    gakuchika: raw.gakuchika ?? undefined,
    avatarUrl: raw.avatarUrl,
    cardTheme: toCardTheme(raw.cardTheme),
    skills: raw.skills,
    hobbies: raw.hobbies,
    qualifications: raw.qualifications,
    snsLinks: {
      twitter: raw.twitter,
      instagram: raw.instagram,
      github: raw.github,
      linkedin: raw.linkedin,
    },
    customLinks: toSortedCustomLinks(raw),
  };

  return <>{children({ myCard })}</>;
};

const toSortedCustomLinks = (raw: GetMeResponse) =>
  raw.customLinks
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(({ title, url }) => ({ title, url }));
