import { getSessionUserId } from "@/lib/auth/session";
import { globalSearch } from "@/server/services/search.service";
import { NextRequest, NextResponse } from "next/server";

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

    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (!q) {
      return NextResponse.json({
        announcements: [],
        members:       [],
        files:         [],
        groups:        [],
      });
    }

    const result = await globalSearch(workspaceId, q);
    return NextResponse.json(result);

  } catch (error) {
    console.error("GET /search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}