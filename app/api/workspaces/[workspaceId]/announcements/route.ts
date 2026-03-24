import { getSessionUserId } from "@/lib/auth/session";
import { getWorkspaceAnnouncements, createAnnouncement } from "@/server/services/announcement.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) {
      return NextResponse.json({ error: "Invalid workspace ID" }, { status: 400 });
    }

    const result = await getWorkspaceAnnouncements(workspaceId);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) {
      return NextResponse.json({ error: "Invalid workspace ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content } = body;

    const result = await createAnnouncement({
      workspaceId,
      authorId: userId,
      title,
      content,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "TITLE_REQUIRED")   return NextResponse.json({ error: "Title is required" },   { status: 400 });
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content is required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}