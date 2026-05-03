import { z } from "zod";
import {
  ENDORSEMENT_EPISODE_MAX,
  ENDORSEMENT_EPISODE_MIN,
  ENDORSEMENT_MAX_TAGS,
  ENDORSEMENT_RELATIONSHIPS,
  ENDORSEMENT_TAGS,
} from "@/constants/endorsement";

export const ENDORSEMENT_PAGE_SIZE = 20;

export const endorsementsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(ENDORSEMENT_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).default(0),
});

const endorsementItemSchema = z.object({
  id: z.string(),
  relationship: z.string().nullable(),
  episode: z.string(),
  tags: z.array(z.string()),
  approvedAt: z.string().nullable(),
  author: z.object({
    uid: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

export const endorsementsResponseSchema = z.object({
  endorsements: z.array(endorsementItemSchema),
  hasMore: z.boolean(),
});

export const createEndorsementRequestSchema = z.object({
  relationship: z.enum(ENDORSEMENT_RELATIONSHIPS),
  episode: z.string().min(ENDORSEMENT_EPISODE_MIN).max(ENDORSEMENT_EPISODE_MAX),
  tags: z
    .array(z.enum(ENDORSEMENT_TAGS))
    .min(1)
    .max(ENDORSEMENT_MAX_TAGS),
});

export const createEndorsementResponseSchema = z.object({
  ok: z.literal(true),
});
