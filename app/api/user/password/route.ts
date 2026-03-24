import { getSessionUserId } from "@/lib/auth/session";
import { updatePassword } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = await updatePassword(userId, body);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND")                 return NextResponse.json({ error: "Not found" },                  { status: 404 });
    if (error.message === "INVALID_PASSWORD")          return NextResponse.json({ error: "Invalid current password" },   { status: 400 });
    if (error.message === "CURRENT_PASSWORD_REQUIRED") return NextResponse.json({ error: "Current password required" },  { status: 400 });
    if (error.message === "NEW_PASSWORD_REQUIRED")     return NextResponse.json({ error: "New password required" },      { status: 400 });
    if (error.message === "PASSWORD_TOO_SHORT")        return NextResponse.json({ error: "Password min 6 characters" },  { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}