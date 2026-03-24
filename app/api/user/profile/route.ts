import { getSessionUserId } from "@/lib/auth/session";
import { getUserProfile, updateProfile } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getUserProfile(userId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = await updateProfile(userId, body);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND")      return NextResponse.json({ error: "Not found" },      { status: 404 });
    if (error.message === "NAME_REQUIRED")  return NextResponse.json({ error: "Name required" },  { status: 400 });
    if (error.message === "EMAIL_REQUIRED") return NextResponse.json({ error: "Email required" }, { status: 400 });
    if (error.message === "EMAIL_TAKEN")    return NextResponse.json({ error: "Email taken" },    { status: 409 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}