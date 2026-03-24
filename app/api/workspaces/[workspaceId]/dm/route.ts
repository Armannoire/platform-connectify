import { getSessionUserId } from "@/lib/auth/session";
import { getWorkspaceMembers } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getWorkspaceMembers(workspaceId, userId);
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}