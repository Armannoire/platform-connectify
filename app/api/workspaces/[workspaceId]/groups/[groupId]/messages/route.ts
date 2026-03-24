import { getSessionUserId } from "@/lib/auth/session";
import { getGroupMessages, sendMessage } from "@/server/services/group.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; groupId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr, groupId: groupIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const groupId     = Number(groupIdStr);
    if (isNaN(workspaceId) || isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await getGroupMessages(groupId, workspaceId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr, groupId: groupIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const groupId     = Number(groupIdStr);
    if (isNaN(workspaceId) || isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { content } = body;

    const result = await sendMessage(groupId, workspaceId, {
      authorId: userId,
      content,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "NOT_FOUND")       return NextResponse.json({ error: "Not found" },         { status: 404 });
    if (error.message === "FORBIDDEN")       return NextResponse.json({ error: "Forbidden" },         { status: 403 });
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}