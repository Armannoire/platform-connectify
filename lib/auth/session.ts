import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET;

type SessionPayload = { userId: number };

export function createSession(userId: number): { success: true; token: string } | { success: false; message: string } {
  if (!SECRET) {
    return { success: false, message: "JWT secret is not configured" };
  }

  try {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
    return { success: true, token };
  } catch (err) {
    return { success: false, message: "Failed to create session" };
  }
}

export function verifySession(token: string): { success: true; payload: SessionPayload } | { success: false; message: string } {
  if (!SECRET) {
    return { success: false, message: "JWT secret is not configured" };
  }

  try {
    const payload = jwt.verify(token, SECRET) as SessionPayload;
    return { success: true, payload };
  } catch {
    return { success: false, message: "Invalid or expired token" };
  }
}

export async function getSessionUserId(): Promise<number | null> {
  const token = (await cookies()).get("session")?.value;

  if (!token) return null;

  const result = verifySession(token);

  if (!result.success) return null;

  return result.payload.userId;
}