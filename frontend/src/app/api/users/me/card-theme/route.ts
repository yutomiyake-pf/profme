import { NextResponse } from "next/server";
import type { UpdateMyCardThemeData, UpdateMyCardThemeVariables } from "@dataconnect/generated";
import { createRoute, withSession, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";
import { updateCardThemeRequestSchema } from "./type";

export const runtime = "nodejs";

export const PUT = createRoute(
  withSession(),
  withZod({ body: updateCardThemeRequestSchema }),
  async ({ user, body }) => {
    await dataConnectAdmin.executeMutation<UpdateMyCardThemeData, UpdateMyCardThemeVariables>(
      "UpdateMyCardTheme",
      { cardTheme: body.cardTheme },
      { impersonate: { authClaims: { sub: user.uid } } },
    );
    return NextResponse.json({ ok: true });
  },
);
