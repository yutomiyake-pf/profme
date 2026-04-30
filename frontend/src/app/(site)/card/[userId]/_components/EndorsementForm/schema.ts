import { z } from "zod";

export const endorsementFormSchema = z.object({
  relationship: z.string(),
  episode: z
    .string()
    .min(30, "30文字以上で入力してください")
    .max(300, "300文字以内で入力してください"),
  tags: z
    .array(z.string())
    .min(1, "評価タグを1つ以上選択してください")
    .max(3, "評価タグは3つまで選択できます"),
});

export type EndorsementFormValues = z.infer<typeof endorsementFormSchema>;

export const defaultEndorsementFormValues: EndorsementFormValues = {
  relationship: "",
  episode: "",
  tags: [],
};
