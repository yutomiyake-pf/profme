import { z } from "zod";

export const followStatusSchema = z.enum(["none", "pending", "approved"]);
export type FollowStatus = z.infer<typeof followStatusSchema>;

export const followRelationshipSchema = z.object({
  outgoing: followStatusSchema,
  incoming: followStatusSchema,
});

export type FollowRelationship = z.infer<typeof followRelationshipSchema>;
