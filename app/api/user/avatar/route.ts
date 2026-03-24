import { getSessionUserId } from "@/lib/auth/session";
import { updateAvatar } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { avatar } = body;

    if (!avatar) {
      return NextResponse.json({ error: "Avatar required" }, { status: 400 });
    }

    const result = await updateAvatar(userId, avatar);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}