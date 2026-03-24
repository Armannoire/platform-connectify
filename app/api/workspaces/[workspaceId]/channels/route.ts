import { getSessionUserId } from "@/lib/auth/session";
import { getWorkspaceChannels, createChannel } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId: workspaceIdStr } = await params;
    const workspaceId = Number(workspaceIdStr);
    if (isNaN(workspaceId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getWorkspaceChannels(workspaceId);
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

    const { name } = await req.json();

    const result = await createChannel({ workspaceId, name, createdBy: userId });
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
  console.error("CHANNEL ERROR:", error.message, error.stack);
  if (error.message === "NAME_REQUIRED") return NextResponse.json({ error: "Name required" }, { status: 400 });
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}