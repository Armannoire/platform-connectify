import { getSessionUserId } from "@/lib/auth/session";
import { updateComment, deleteComment } from "@/server/services/announcement.interaction.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ commentId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { commentId: commentIdStr } = await params;
    const commentId = Number(commentIdStr);
    if (isNaN(commentId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { content } = await req.json();

    const result = await updateComment(commentId, userId, { content });
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND")        return NextResponse.json({ error: "Not found" },        { status: 404 });
    if (error.message === "FORBIDDEN")        return NextResponse.json({ error: "Forbidden" },        { status: 403 });
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { commentId: commentIdStr } = await params;
    const commentId = Number(commentIdStr);
    if (isNaN(commentId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await deleteComment(commentId, userId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}