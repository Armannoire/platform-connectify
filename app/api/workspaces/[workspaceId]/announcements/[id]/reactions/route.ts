import { getSessionUserId } from "@/lib/auth/session";
import { getReactions, toggleReaction } from "@/server/services/announcement.interaction.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: idStr } = await params;
    const announcementId = Number(idStr);
    if (isNaN(announcementId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const result = await getReactions(announcementId);
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

    const { emoji } = await req.json();
    if (!emoji) return NextResponse.json({ error: "Emoji required" }, { status: 400 });

    const result = await toggleReaction(announcementId, userId, emoji);
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}