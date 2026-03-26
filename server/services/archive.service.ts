import { archiveRepository } from "../repositories/archive.repo";
import type { ArchiveFile, ArchiveFileWithData, UploadFileData } from "../repositories/archive.repo";

// ── Get All ───────────────────────────────────────────────────

export async function getWorkspaceFiles(
  workspaceId: number,
  category?: string
): Promise<{ data: ArchiveFile[]; total: number }> {
  const data = await archiveRepository.findAll(workspaceId, category);
  return { data, total: data.length };
}

// ── Get One (with data for download) ─────────────────────────

export async function getFileForDownload(
  fileId: number,
  workspaceId: number
): Promise<ArchiveFileWithData> {
  const belongs = await archiveRepository.belongsToWorkspace(fileId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const file = await archiveRepository.findByIdWithData(fileId);
  if (!file) throw new Error("NOT_FOUND");

  return file;
}

// ── Upload ────────────────────────────────────────────────────

export async function uploadFile(
  data: UploadFileData
): Promise<{ data: ArchiveFile }> {
  if (!data.name?.trim())    throw new Error("NAME_REQUIRED");
  if (!data.mimeType?.trim()) throw new Error("INVALID_FILE");
  if (!data.data)            throw new Error("FILE_REQUIRED");

  const file = await archiveRepository.upload(data);
  return { data: file };
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteFile(
  fileId: number,
  workspaceId: number,
  userId: number
): Promise<{ success: boolean }> {
  const belongs = await archiveRepository.belongsToWorkspace(fileId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const file = await archiveRepository.findById(fileId);
  if (!file) throw new Error("NOT_FOUND");

  if (file.uploadedBy !== userId) throw new Error("FORBIDDEN");

  await archiveRepository.delete(fileId);
  return { success: true };
}

// ── Category detector ─────────────────────────────────────────

export function detectCategory(mimeType: string): "documents" | "images" | "videos" | "other" {
  if (mimeType.startsWith("image/"))                                          return "images";
  if (mimeType.startsWith("video/"))                                          return "videos";
  if (["application/pdf", "application/msword", "application/vnd",
       "text/plain", "text/csv"].some((t) => mimeType.startsWith(t)))        return "documents";
  return "other";
}