import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }

  try {
    await jwtVerify(token, SECRET);

    if (pathname === "/") {
      const workspaceRes = await fetch(
        `${req.nextUrl.origin}/api/workspaces`,
        { headers: { Cookie: `session=${token}` } }
      );

      if (workspaceRes.ok) {
        const data = await workspaceRes.json();
        const workspaceId = data?.data?.[0]?.id;
        if (workspaceId) {
          return NextResponse.redirect(new URL(`/workspace/${workspaceId}`, req.url));
        }
      }
    }

    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;

  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};