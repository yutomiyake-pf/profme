import { z } from "zod";

export const sessionResponseSchema = z.object({
  ok: z.literal(true),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
