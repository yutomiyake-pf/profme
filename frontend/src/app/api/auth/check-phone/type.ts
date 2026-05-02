import { z } from "zod";

export const checkPhoneResponseSchema = z.object({
  exists: z.boolean(),
});

export type CheckPhoneResponse = z.infer<typeof checkPhoneResponseSchema>;
