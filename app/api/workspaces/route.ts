import { getSessionUserId } from "@/lib/auth/session";
import { create, findAllByUserId, findByOwnerId } from "@/server/repositories/workspace.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    try {
        const userId = await getSessionUserId()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401});
        }

        const workspaces = await findAllByUserId(userId);

        return NextResponse.json({data: workspaces, total: workspaces.length})
    } catch (error){
        return NextResponse.json({error: "Internal server Error"}, { status: 500})
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await getSessionUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, {status: 401});
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400});
        }

        const existing = await findByOwnerId(userId);

        if (existing) {
            return NextResponse.json({ error: "You already have a workspace"}, { status: 409});
        }

        const workspace = await create({
            name: name.trim(),
            ownerId: userId
        })

        return NextResponse.json({ data: workspace }, { status: 201 });
    } catch (error){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}