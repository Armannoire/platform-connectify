import { getSessionUserId } from "@/lib/auth/session";
import { getFileForDownload, deleteFile } from "@/server/services/archive.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; fileId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, fileId: fileIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const fileId      = Number(fileIdStr);
    if (isNaN(workspaceId) || isNaN(fileId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const file = await getFileForDownload(fileId, workspaceId);

    const buffer = Buffer.isBuffer(file.data)
      ? file.data
      : Buffer.from(file.data);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":        file.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
        "Content-Length":      String(buffer.length),
      },
    });

  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr, fileId: fileIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    const fileId      = Number(fileIdStr);
    if (isNaN(workspaceId) || isNaN(fileId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await deleteFile(fileId, workspaceId, userId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}