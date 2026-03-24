import { getSessionUserId } from "@/lib/auth/session";
import { addMember, removeMember } from "@/server/services/group.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ workspaceId: string; groupId: string }> };

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
    const targetUserId = Number(body.userId);
    if (isNaN(targetUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const result = await addMember(groupId, workspaceId, targetUserId);
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    if (error.message === "NOT_FOUND")      return NextResponse.json({ error: "Not found" },        { status: 404 });
    if (error.message === "ALREADY_MEMBER") return NextResponse.json({ error: "Already a member" }, { status: 409 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
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
    const targetUserId = Number(body.userId);
    if (isNaN(targetUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const result = await removeMember(groupId, workspaceId, userId, targetUserId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}