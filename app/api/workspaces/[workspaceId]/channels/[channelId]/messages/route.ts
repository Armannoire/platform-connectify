import { getSessionUserId } from "@/lib/auth/session";
import { getChannelMessages, sendChannelMessage } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; channelId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, channelId: channelIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const channelId   = Number(channelIdStr);
    if (isNaN(workspaceId) || isNaN(channelId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getChannelMessages(channelId, workspaceId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, channelId: channelIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const channelId   = Number(channelIdStr);
    if (isNaN(workspaceId) || isNaN(channelId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { content } = await req.json();

    const result = await sendChannelMessage(channelId, workspaceId, {
      authorId: userId,
      content,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "NOT_FOUND")        return NextResponse.json({ error: "Not found" },        { status: 404 });
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}