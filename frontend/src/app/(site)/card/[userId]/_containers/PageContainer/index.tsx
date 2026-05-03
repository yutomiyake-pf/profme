import "server-only";

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { followRelationshipSchema } from "@/app/api/users/[userId]/follow/type";
import { getUserResponseSchema } from "@/app/api/users/[userId]/type";
import { type CardTheme, cardThemes } from "@/constants/cardTheme";
import { getCurrentUser } from "@/lib/auth/server";
import { serverFetcher } from "@/lib/fetcher/server";

const validThemeIds = new Set<string>(cardThemes.map((t) => t.id));
const toCardTheme = (raw: string): CardTheme =>
  validThemeIds.has(raw) ? (raw as CardTheme) : "navy";

export type FollowEdgeStatus = "none" | "pending" | "approved";

export interface CardFollowRelationship {
  outgoing: FollowEdgeStatus;
  incoming: FollowEdgeStatus;
}

export interface CardProfile {
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

export interface CardPageRenderProps {
  profile: CardProfile;
  isOwner: boolean;
  isLoggedIn: boolean;
  relationship: CardFollowRelationship | null;
}

interface Props {
  userId: string;
  children: (props: CardPageRenderProps) => ReactNode;
}

export const PageContainer = async ({ userId, children }: Props) => {
  const [raw, viewer] = await Promise.all([
    serverFetcher(`/api/users/${encodeURIComponent(userId)}`, {
      schema: getUserResponseSchema,
      cache: "no-store",
      throwErr: false,
    }),
    getCurrentUser(),
  ]);

  if (!raw) notFound();

  const isOwner = viewer?.uid === raw.uid;
  const isLoggedIn = !!viewer;

  const rawRelationship =
    isLoggedIn && !isOwner
      ? await serverFetcher(`/api/users/${encodeURIComponent(raw.uid)}/follow`, {
          schema: followRelationshipSchema,
          cache: "no-store",
          throwErr: false,
        })
      : null;

  const relationship: CardFollowRelationship | null = rawRelationship
    ? { outgoing: rawRelationship.outgoing, incoming: rawRelationship.incoming }
    : null;

  const profile: CardProfile = {
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
    customLinks: raw.customLinks.map(({ title, url }) => ({ title, url })),
  };

  return <>{children({ profile, isOwner, isLoggedIn, relationship })}</>;
};
