import { z } from "zod";

export const ENDORSEMENT_REQUESTS_PAGE_SIZE = 20;

export const endorsementRequestsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(ENDORSEMENT_REQUESTS_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).default(0),
});

const endorsementRequestItemSchema = z.object({
  id: z.string(),
  relationship: z.string().nullable(),
  episode: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  author: z.object({
    uid: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

export const endorsementRequestsResponseSchema = z.object({
  endorsements: z.array(endorsementRequestItemSchema),
  total: z.number().int().min(0),
});

export type EndorsementRequestsResponse = z.infer<typeof endorsementRequestsResponseSchema>;

export const endorsementRequestActionResponseSchema = z.object({
  ok: z.literal(true),
});

export type EndorsementRequestActionResponse = z.infer<
  typeof endorsementRequestActionResponseSchema
>;
