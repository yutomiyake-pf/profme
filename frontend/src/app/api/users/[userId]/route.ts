import { NextResponse } from "next/server";
import type { GetProfileData, GetProfileVariables } from "@dataconnect/generated";
import { maskProfileForViewer } from "@/app/api/utils/profileMask";
import { getCurrentUser } from "@/lib/auth/server";
import { dataConnectAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const [{ data }, viewer] = await Promise.all([
    dataConnectAdmin.executeQuery<GetProfileData, GetProfileVariables>("GetProfile", {
      uid: userId,
    }),
    getCurrentUser(),
  ]);
  if (!data.user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }
  const isOwner = viewer?.uid === data.user.uid;
  return NextResponse.json(maskProfileForViewer(data.user, isOwner));
}
