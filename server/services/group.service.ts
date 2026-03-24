import { groupRepository } from "../repositories/group.repo";
import type {
  GroupWithMembers,
  GroupListResponse,
  GroupResponse,
  GroupMessageListResponse,
  GroupMessage,
  CreateGroupData,
  UpdateGroupData,
  SendMessageData,
} from "@/types/group";

// ── Get All ───────────────────────────────────────────────────

export async function getWorkspaceGroups(
  workspaceId: number
): Promise<GroupListResponse> {
  const data = await groupRepository.findAll(workspaceId);
  return { data, total: data.length };
}

// ── Get One ───────────────────────────────────────────────────

export async function getGroupById(
  id: number,
  workspaceId: number
): Promise<GroupResponse> {
  const belongs = await groupRepository.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const data = await groupRepository.findById(id);
  if (!data) throw new Error("NOT_FOUND");

  return { data };
}

// ── Create ────────────────────────────────────────────────────

export async function createGroup(
  data: CreateGroupData
): Promise<GroupResponse> {
  if (!data.name?.trim()) throw new Error("NAME_REQUIRED");

  const group = await groupRepository.create({
    ...data,
    name:        data.name.trim(),
    description: data.description?.trim(),
  });

  return { data: group };
}

// ── Update ────────────────────────────────────────────────────

export async function updateGroup(
  id: number,
  workspaceId: number,
  userId: number,
  data: UpdateGroupData
): Promise<GroupResponse> {
  const belongs = await groupRepository.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const existing = await groupRepository.findById(id);
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.createdBy !== userId) throw new Error("FORBIDDEN");

  if (data.name !== undefined && !data.name.trim()) throw new Error("NAME_REQUIRED");

  const updated = await groupRepository.update(id, {
    name:        data.name?.trim(),
    description: data.description?.trim(),
  });

  return { data: updated as GroupWithMembers };
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteGroup(
  id: number,
  workspaceId: number,
  userId: number
): Promise<{ success: boolean }> {
  const belongs = await groupRepository.belongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const existing = await groupRepository.findById(id);
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.createdBy !== userId) throw new Error("FORBIDDEN");

  await groupRepository.delete(id);
  return { success: true };
}

// ── Members ───────────────────────────────────────────────────

export async function addMember(
  groupId: number,
  workspaceId: number,
  userId: number
): Promise<{ success: boolean }> {
  const belongs = await groupRepository.belongsToWorkspace(groupId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const already = await groupRepository.isMember(groupId, userId);
  if (already) throw new Error("ALREADY_MEMBER");

  await groupRepository.addMember(groupId, userId);
  return { success: true };
}

export async function removeMember(
  groupId: number,
  workspaceId: number,
  requesterId: number,
  targetUserId: number
): Promise<{ success: boolean }> {
  const belongs = await groupRepository.belongsToWorkspace(groupId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const existing = await groupRepository.findById(groupId);
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.createdBy !== requesterId && requesterId !== targetUserId) {
    throw new Error("FORBIDDEN");
  }

  await groupRepository.removeMember(groupId, targetUserId);
  return { success: true };
}

// ── Messages ──────────────────────────────────────────────────

export async function getGroupMessages(
  groupId: number,
  workspaceId: number
): Promise<GroupMessageListResponse> {
  const belongs = await groupRepository.belongsToWorkspace(groupId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const data = await groupRepository.findMessages(groupId);
  return { data, total: data.length };
}

export async function sendMessage(
  groupId: number,
  workspaceId: number,
  data: Omit<SendMessageData, "groupId">
): Promise<{ data: GroupMessage }> {
  const belongs = await groupRepository.belongsToWorkspace(groupId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const isMember = await groupRepository.isMember(groupId, data.authorId);
  if (!isMember) throw new Error("FORBIDDEN");

  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const message = await groupRepository.sendMessage({
    groupId,
    authorId: data.authorId,
    content:  data.content.trim(),
  });

  return { data: message };
}

export async function deleteMessage(
  messageId: number,
  userId: number
): Promise<{ success: boolean }> {
  const message = await groupRepository.findMessageById(messageId);
  if (!message) throw new Error("NOT_FOUND");

  if (message.authorId !== userId) throw new Error("FORBIDDEN");

  await groupRepository.deleteMessage(messageId);
  return { success: true };
}