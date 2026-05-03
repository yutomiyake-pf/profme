import { z } from "zod";
import { cardThemeIds } from "@/constants/cardTheme";

export const updateCardThemeRequestSchema = z.object({
  cardTheme: z.enum(cardThemeIds),
});

export type UpdateCardThemeRequest = z.infer<typeof updateCardThemeRequestSchema>;

export const updateCardThemeResponseSchema = z.object({
  ok: z.literal(true),
});

export type UpdateCardThemeResponse = z.infer<typeof updateCardThemeResponseSchema>;
