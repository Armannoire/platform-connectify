import { getSessionUserId } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

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

    const [rows]: any = await db.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.avatar
       FROM workspace_members wm
       JOIN users u ON u.id = wm.userId
       WHERE wm.workspaceId = ?
       ORDER BY u.name ASC`,
      [workspaceId]
    );

    return NextResponse.json({ data: rows, total: rows.length });

  } catch (error) {
    console.error("GET /members error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}