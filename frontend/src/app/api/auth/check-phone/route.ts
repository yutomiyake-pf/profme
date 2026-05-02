import { NextResponse } from "next/server";
import { z } from "zod";
import type { GetUserByPhoneData, GetUserByPhoneVariables } from "@dataconnect/generated";
import { createRoute, withZod } from "@/app/api/utils";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const bodySchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "invalid_phone"),
});

export const POST = createRoute(withZod({ body: bodySchema }), async ({ body }) => {
  const { data } = await dataConnectAdmin.executeQuery<GetUserByPhoneData, GetUserByPhoneVariables>(
    "GetUserByPhone",
    { phoneNumber: body.phoneNumber },
  );
  return NextResponse.json({ exists: !!data.user });
});
