import { NextResponse } from "next/server";
import { login } from "@/server/services/auth.service";
import { createSession } from "@/lib/auth/session";
import * as workspaceService from "@/server/services/workspace.service";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body: LoginRequestBody = await req.json();

    const { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }

    const user = await login(email, password);

    if (!user.success) {
      return NextResponse.json(
        { error: user.message },
        { status: 401 }
      );
    }

    const userData = user.data!;
    const session = await createSession(userData.id);

    if (!session.success) {
      return NextResponse.json(
        { error: session.message },
        { status: 500 }
      );
    }

    const workspace = await workspaceService.getOrCreate(userData.id);

  const res = NextResponse.json({
    success: true,
    workspaceId: workspace.id, 
  });

    res.cookies.set("session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { error: "Login failed due to server error" },
      { status: 500 }
    );
  }
}
