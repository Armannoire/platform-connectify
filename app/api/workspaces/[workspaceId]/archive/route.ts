import { getSessionUserId } from "@/lib/auth/session";
import { getWorkspaceFiles, uploadFile, detectCategory } from "@/server/services/archive.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const category = req.nextUrl.searchParams.get("category") || undefined;

    const result = await getWorkspaceFiles(workspaceId, category);
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();
    const { name, mimeType, size, data } = body;

    if (!data) return NextResponse.json({ error: "File data required" }, { status: 400 });

    const buffer = Buffer.from(data, "base64");
    const category = detectCategory(mimeType);

    const result = await uploadFile({
      workspaceId,
      uploadedBy: userId,
      name,
      category,
      mimeType,
      size,
      data: buffer,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "NAME_REQUIRED")  return NextResponse.json({ error: "Name required" },  { status: 400 });
    if (error.message === "FILE_REQUIRED")  return NextResponse.json({ error: "File required" },  { status: 400 });
    if (error.message === "INVALID_FILE")   return NextResponse.json({ error: "Invalid file" },   { status: 400 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}