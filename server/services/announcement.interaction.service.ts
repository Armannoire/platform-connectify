import { announcementInteractionRepository as repo } from "../repositories/announcement.interaction.repo";
import type {
  AnnouncementComment,
  AnnouncementCommentsResponse,
  AnnouncementReactionsResponse,
  CreateCommentData,
  UpdateCommentData,
} from "@/types/announcement.ts";

// ── Reactions ─────────────────────────────────────────────────

export async function getReactions(
  announcementId: number
): Promise<AnnouncementReactionsResponse> {
  const data = await repo.getReactions(announcementId);
  return { data };
}

export async function toggleReaction(
  announcementId: number,
  userId: number,
  emoji: string
): Promise<{ added: boolean }> {
  const already = await repo.hasReacted(announcementId, userId, emoji);

  if (already) {
    await repo.removeReaction(announcementId, userId, emoji);
    return { added: false };
  } else {
    await repo.addReaction({ announcementId, userId, emoji });
    return { added: true };
  }
}

// ── Comments ──────────────────────────────────────────────────

export async function getComments(
  announcementId: number
): Promise<AnnouncementCommentsResponse> {
  const data = await repo.getComments(announcementId);
  return { data, total: data.length };
}

export async function createComment(
  data: CreateCommentData
): Promise<{ data: AnnouncementComment }> {
  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const comment = await repo.createComment({
    ...data,
    content: data.content.trim(),
  });

  return { data: comment };
}

export async function updateComment(
  id: number,
  userId: number,
  data: UpdateCommentData
): Promise<{ data: AnnouncementComment }> {
  const existing = await repo.findCommentById(id);
  if (!existing) throw new Error("NOT_FOUND");
  if (existing.authorId !== userId) throw new Error("FORBIDDEN");
  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const updated = await repo.updateComment(id, { content: data.content.trim() });
  return { data: updated as AnnouncementComment };
}

export async function deleteComment(
  id: number,
  userId: number
): Promise<{ success: boolean }> {
  const existing = await repo.findCommentById(id);
  if (!existing) throw new Error("NOT_FOUND");
  if (existing.authorId !== userId) throw new Error("FORBIDDEN");

  await repo.deleteComment(id);
  return { success: true };
}