import { z } from "zod";

export const FOLLOWERS_PAGE_SIZE = 20;

export const followersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(FOLLOWERS_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).default(0),
});

const followerItemSchema = z.object({
  follower: z.object({
    uid: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    university: z.string().nullable(),
  }),
  approvedAt: z.string().nullable(),
});

export const followersResponseSchema = z.object({
  followers: z.array(followerItemSchema),
  total: z.number().int().min(0),
});

export type FollowersResponse = z.infer<typeof followersResponseSchema>;

export const followerActionResponseSchema = z.object({
  ok: z.literal(true),
});

export type FollowerActionResponse = z.infer<typeof followerActionResponseSchema>;
