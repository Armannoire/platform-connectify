import { getSessionUserId } from "@/lib/auth/session";
import { getAnnouncementById, updateAnnouncement, deleteAnnouncement } from "@/server/services/announcement.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr, id: idStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const id          = Number(idStr);
    if (isNaN(workspaceId) || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await getAnnouncementById(id, workspaceId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr, id: idStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const id          = Number(idStr);
    if (isNaN(workspaceId) || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const result = await updateAnnouncement(id, workspaceId, userId, body);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND")        return NextResponse.json({ error: "Not found" },            { status: 404 });
    if (error.message === "FORBIDDEN")        return NextResponse.json({ error: "Forbidden" },            { status: 403 });
    if (error.message === "TITLE_REQUIRED")   return NextResponse.json({ error: "Title is required" },   { status: 400 });
    if (error.message === "CONTENT_REQUIRED") return NextResponse.json({ error: "Content is required" }, { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId: workspaceIdStr, id: idStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const id          = Number(idStr);
    if (isNaN(workspaceId) || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await deleteAnnouncement(id, workspaceId, userId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}