import { z } from "zod";

export const getUserResponseSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  university: z.string().nullable(),
  faculty: z.string().nullable(),
  grade: z.string().nullable(),
  bio: z.string().nullable(),
  gakuchika: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  cardTheme: z.string(),
  twitter: z.string().nullable(),
  instagram: z.string().nullable(),
  github: z.string().nullable(),
  linkedin: z.string().nullable(),
  skills: z.array(z.string()),
  hobbies: z.array(z.string()),
  qualifications: z.array(z.string()),
  universityVisible: z.boolean(),
  snsVisible: z.boolean(),
  endorsementsVisible: z.boolean(),
  customLinksVisible: z.boolean(),
  customLinks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      createdAt: z.string(),
    }),
  ),
});

export type GetUserResponse = z.infer<typeof getUserResponseSchema>;
