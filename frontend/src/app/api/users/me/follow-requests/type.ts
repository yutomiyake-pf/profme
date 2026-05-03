import { z } from "zod";

export const FOLLOW_REQUESTS_PAGE_SIZE = 20;

export const followRequestsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(FOLLOW_REQUESTS_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).default(0),
});

const followRequestItemSchema = z.object({
  follower: z.object({
    uid: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    university: z.string().nullable(),
  }),
  requestedAt: z.string(),
});

export const followRequestsResponseSchema = z.object({
  requests: z.array(followRequestItemSchema),
  total: z.number().int().min(0),
});

export type FollowRequestsResponse = z.infer<typeof followRequestsResponseSchema>;

export const followRequestActionResponseSchema = z.object({
  ok: z.literal(true),
});

export type FollowRequestActionResponse = z.infer<typeof followRequestActionResponseSchema>;
