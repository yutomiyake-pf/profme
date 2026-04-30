import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("URLの形式が正しくありません")]);

const customLinkSchema = z.object({
  title: z.string().max(50, "50文字以内で入力してください"),
  url: optionalUrl,
});

export const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(1, "表示名を入力してください")
    .max(20, "20文字以内で入力してください"),
  university: z.string().max(30, "30文字以内で入力してください"),
  faculty: z.string().max(30, "30文字以内で入力してください"),
  grade: z.string(),
  bio: z.string().max(200, "200文字以内で入力してください"),
  gakuchika: z.string().max(500, "500文字以内で入力してください"),
  avatarUrl: z.string(),
  twitter: optionalUrl,
  instagram: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  customLinks: z.array(customLinkSchema).max(10),
  skills: z.array(z.string().max(20, "20文字以内で入力してください")).max(10),
  hobbies: z.array(z.string().max(20, "20文字以内で入力してください")).max(10),
  qualifications: z.array(z.string().max(20, "20文字以内で入力してください")).max(10),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const defaultProfileFormValues: ProfileFormValues = {
  displayName: "",
  university: "",
  faculty: "",
  grade: "",
  bio: "",
  gakuchika: "",
  avatarUrl: "",
  twitter: "",
  instagram: "",
  github: "",
  linkedin: "",
  customLinks: [],
  skills: [],
  hobbies: [],
  qualifications: [],
};

export const stepFields = {
  1: ["displayName", "university", "faculty", "grade", "bio", "gakuchika", "avatarUrl"],
  2: ["twitter", "instagram", "github", "linkedin", "customLinks"],
  3: ["skills", "hobbies", "qualifications"],
} as const satisfies Record<1 | 2 | 3, ReadonlyArray<keyof ProfileFormValues>>;
