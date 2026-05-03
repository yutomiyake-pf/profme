"use client";

import { type ReactNode } from "react";
import { createEndorsementResponseSchema } from "@/app/api/users/[userId]/endorsements/type";
import type { EndorsementRelationship, EndorsementTag } from "@/constants/endorsement";
import { clientFetcher } from "@/lib/fetcher/client";

export interface CreateEndorsementInput {
  relationship: EndorsementRelationship;
  episode: string;
  tags: EndorsementTag[];
}

export interface CreateEndorsementRenderProps {
  createEndorsement: (input: CreateEndorsementInput) => Promise<void>;
}

interface Props {
  userId: string;
  children: (props: CreateEndorsementRenderProps) => ReactNode;
}

export const CreateEndorsementContainer = ({ userId, children }: Props) => {
  const createEndorsement = async (input: CreateEndorsementInput) => {
    await clientFetcher(`/api/users/${userId}/endorsements`, {
      method: "POST",
      schema: createEndorsementResponseSchema,
      body: input,
    });
  };

  return <>{children({ createEndorsement })}</>;
};
