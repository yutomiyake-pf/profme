import { NextResponse } from "next/server";
import type { GetProfileData, GetProfileVariables } from "@dataconnect/generated";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const { data } = await dataConnectAdmin.executeQuery<GetProfileData, GetProfileVariables>(
    "GetProfile",
    { uid: userId },
  );
  if (!data.user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }
  return NextResponse.json(data.user);
}
