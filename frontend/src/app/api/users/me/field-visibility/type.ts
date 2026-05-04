import { z } from "zod";

export const updateFieldVisibilityRequestSchema = z.object({
  universityVisible: z.boolean(),
  snsVisible: z.boolean(),
  endorsementsVisible: z.boolean(),
  customLinksVisible: z.boolean(),
});

export type UpdateFieldVisibilityRequest = z.infer<typeof updateFieldVisibilityRequestSchema>;

export const updateFieldVisibilityResponseSchema = z.object({
  ok: z.literal(true),
});

export type UpdateFieldVisibilityResponse = z.infer<typeof updateFieldVisibilityResponseSchema>;
