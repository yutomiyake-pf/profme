import { z } from "zod";
import {
  ENDORSEMENT_EPISODE_MAX,
  ENDORSEMENT_EPISODE_MIN,
  ENDORSEMENT_MAX_TAGS,
  ENDORSEMENT_RELATIONSHIPS,
  ENDORSEMENT_TAGS,
} from "@/constants/endorsement";

export const endorsementFormSchema = z.object({
  relationship: z.enum(ENDORSEMENT_RELATIONSHIPS, {
    message: "関係性を選択してください",
  }),
  episode: z
    .string()
    .min(ENDORSEMENT_EPISODE_MIN, `${ENDORSEMENT_EPISODE_MIN}文字以上で入力してください`)
    .max(ENDORSEMENT_EPISODE_MAX, `${ENDORSEMENT_EPISODE_MAX}文字以内で入力してください`),
  tags: z
    .array(z.enum(ENDORSEMENT_TAGS))
    .min(1, "評価タグを1つ以上選択してください")
    .max(ENDORSEMENT_MAX_TAGS, `評価タグは${ENDORSEMENT_MAX_TAGS}つまで選択できます`),
});

export type EndorsementFormValues = z.infer<typeof endorsementFormSchema>;
