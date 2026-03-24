import { getSessionUserId } from "@/lib/auth/session";
import { deleteChannelMessage } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ messageId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messageId: messageIdStr } = await params;
    const messageId = Number(messageIdStr);
    if (isNaN(messageId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await deleteChannelMessage(messageId, userId);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "NOT_FOUND") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}