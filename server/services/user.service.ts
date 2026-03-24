import { userRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";

// ── Get Profile ───────────────────────────────────────────────

export async function getUserProfile(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("NOT_FOUND");
  return { data: user };
}

// ── Update Profile ────────────────────────────────────────────

export async function updateProfile(
  userId: number,
  data: { name?: string; email?: string }
) {
  if (data.name !== undefined && !data.name.trim()) {
    throw new Error("NAME_REQUIRED");
  }
  if (data.email !== undefined && !data.email.trim()) {
    throw new Error("EMAIL_REQUIRED");
  }

  if (data.email) {
    const existing = await userRepository.findByEmail(data.email.trim());
    if (existing && existing.id !== userId) {
      throw new Error("EMAIL_TAKEN");
    }
  }

  const updated = await userRepository.updateProfile(userId, {
    name:  data.name?.trim(),
    email: data.email?.trim(),
  });

  return { data: updated };
}

// ── Update Password ───────────────────────────────────────────

export async function updatePassword(
  userId: number,
  data: { currentPassword: string; newPassword: string }
) {
  if (!data.currentPassword) throw new Error("CURRENT_PASSWORD_REQUIRED");
  if (!data.newPassword)     throw new Error("NEW_PASSWORD_REQUIRED");
  if (data.newPassword.length < 6) throw new Error("PASSWORD_TOO_SHORT");

  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) throw new Error("NOT_FOUND");

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) throw new Error("INVALID_PASSWORD");

  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  await userRepository.updatePassword(userId, passwordHash);

  return { success: true };
}

// ── Update Avatar ─────────────────────────────────────────────

export async function updateAvatar(userId: number, avatar: string) {
  if (!avatar) throw new Error("AVATAR_REQUIRED");

  const updated = await userRepository.updateAvatar(userId, avatar);
  return { data: updated };
}