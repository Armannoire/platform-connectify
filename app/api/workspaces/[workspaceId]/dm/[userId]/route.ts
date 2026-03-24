import { getSessionUserId } from "@/lib/auth/session";
import { getDirectMessages, sendDirectMessage } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; userId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const currentUserId = await getSessionUserId();
    if (!currentUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, userId: userIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const targetUserId = Number(userIdStr);
    if (isNaN(workspaceId) || isNaN(targetUserId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getDirectMessages(currentUserId, targetUserId, workspaceId);
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const currentUserId = await getSessionUserId();
    if (!currentUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, userId: userIdStr } = await params;
    const workspaceId  = Number(workspaceIdStr);
    const targetUserId = Number(userIdStr);
    if (isNaN(workspaceId) || isNaN(targetUserId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { content } = await req.json();

    const result = await sendDirectMessage({
      senderId:   currentUserId,
      receiverId: targetUserId,
      workspaceId,
      content,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}