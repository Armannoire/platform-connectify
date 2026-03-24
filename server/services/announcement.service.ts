import { announcementRepository as announcementRepo } from "../repositories/announcement.repo";
import type {
  AnnouncementWithAuthor,
  AnnouncementListResponse,
  AnnouncementResponse,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "@/types/announcement.ts";

// ── Get All ───────────────────────────────────────────────────

export async function getWorkspaceAnnouncements(
  workspaceId: number
): Promise<AnnouncementListResponse> {
  const data = await announcementRepo.findAll(workspaceId);
  return { data, total: data.length };
}

// ── Get One ───────────────────────────────────────────────────

export async function getAnnouncementById(
  id: number,
  workspaceId: number
): Promise<AnnouncementResponse> {
  const belongs = await announcementRepo.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const data = await announcementRepo.findById(id);
  if (!data) throw new Error("NOT_FOUND");

  return { data };
}

// ── Create ────────────────────────────────────────────────────

export async function createAnnouncement(
  data: CreateAnnouncementData
): Promise<AnnouncementResponse> {
  if (!data.title?.trim())   throw new Error("TITLE_REQUIRED");
  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const announcement = await announcementRepo.create({
    ...data,
    title:   data.title.trim(),
    content: data.content.trim(),
  });

  return { data: announcement };
}

// ── Update ────────────────────────────────────────────────────

export async function updateAnnouncement(
  id: number,
  workspaceId: number,
  authorId: number,
  data: UpdateAnnouncementData
): Promise<AnnouncementResponse> {
  const belongs = await announcementRepo.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const existing = await announcementRepo.findById(id);
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.authorId !== authorId) throw new Error("FORBIDDEN");

  if (data.title   !== undefined && !data.title.trim())   throw new Error("TITLE_REQUIRED");
  if (data.content !== undefined && !data.content.trim()) throw new Error("CONTENT_REQUIRED");

  const updated = await announcementRepo.update(id, {
    title:   data.title?.trim(),
    content: data.content?.trim(),
  });

  return { data: updated as AnnouncementWithAuthor };
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteAnnouncement(
  id: number,
  workspaceId: number,
  authorId: number
): Promise<{ success: boolean }> {
  const belongs = await announcementRepo.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const existing = await announcementRepo.findById(id);
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.authorId !== authorId) throw new Error("FORBIDDEN");

  await announcementRepo.delete(id);

  return { success: true };
}