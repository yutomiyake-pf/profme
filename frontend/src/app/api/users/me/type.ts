import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("URLの形式が正しくありません")]);

/** GET /api/users/me のレスポンス */
export const getMeResponseSchema = z.object({
  uid: z.string(),
  phoneNumber: z.string(),
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

export type GetMeResponse = z.infer<typeof getMeResponseSchema>;

/** PUT /api/users/me のリクエスト body (= 編集フォームの送信内容) */
export const updateMeRequestSchema = z.object({
  displayName: z.string().trim().min(1).max(20),
  university: z.string().max(30),
  faculty: z.string().max(30),
  grade: z.string(),
  bio: z.string().max(200),
  gakuchika: z.string().max(500),
  avatarUrl: z.string(),
  twitter: optionalUrl,
  instagram: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  skills: z.array(z.string().max(20)).max(10),
  hobbies: z.array(z.string().max(20)).max(10),
  qualifications: z.array(z.string().max(20)).max(10),
  customLinks: z
    .array(
      z.object({
        title: z.string().min(1).max(50),
        url: optionalUrl,
      }),
    )
    .max(10),
});

export type UpdateMeRequest = z.infer<typeof updateMeRequestSchema>;

/** PUT /api/users/me のレスポンス */
export const updateMeResponseSchema = z.object({
  ok: z.literal(true),
});

export type UpdateMeResponse = z.infer<typeof updateMeResponseSchema>;

/** DELETE /api/users/me (退会) のレスポンス */
export const deleteMeResponseSchema = z.object({
  ok: z.literal(true),
});

export type DeleteMeResponse = z.infer<typeof deleteMeResponseSchema>;
