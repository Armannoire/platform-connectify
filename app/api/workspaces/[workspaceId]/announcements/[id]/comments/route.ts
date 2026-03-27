import { getSessionUserId } from "@/lib/auth/session";
import { getComments, createComment } from "@/server/services/announcement.interaction.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: idStr } = await params;
    const announcementId = Number(idStr);
    if (isNaN(announcementId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getComments(announcementId);
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: idStr } = await params;
    const announcementId = Number(idStr);
    if (isNaN(announcementId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { content, parentId } = await req.json();

    const result = await createComment({
      announcementId,
      authorId: userId,
      content,
      parentId,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}