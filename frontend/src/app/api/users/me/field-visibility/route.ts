import { NextResponse } from "next/server";
import type {
  UpdateMyFieldVisibilityData,
  UpdateMyFieldVisibilityVariables,
} from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { updateFieldVisibilityRequestSchema } from "./type";

export const runtime = "nodejs";

export const PUT = createRoute(
  withSession(),
  withZod({ body: updateFieldVisibilityRequestSchema }),
  async ({ user, body }) => {
    await dataConnectAdmin.executeMutation<
      UpdateMyFieldVisibilityData,
      UpdateMyFieldVisibilityVariables
    >(
      "UpdateMyFieldVisibility",
      {
        universityVisible: body.universityVisible,
        snsVisible: body.snsVisible,
        endorsementsVisible: body.endorsementsVisible,
        customLinksVisible: body.customLinksVisible,
      },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  },
);
