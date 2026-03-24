import { chatRepository } from "../repositories/chat.repo";
import type {
  Channel,
  ChannelMessage,
  DirectMessage,
  ChannelListResponse,
  ChannelMessageListResponse,
  DirectMessageListResponse,
  DMUserListResponse,
  CreateChannelData,
  SendChannelMessageData,
  SendDirectMessageData,
} from "@/types/chat";

// ── Channels ──────────────────────────────────────────────────

export async function getWorkspaceChannels(
  workspaceId: number
): Promise<ChannelListResponse> {
  const data = await chatRepository.findAllChannels(workspaceId);
  return { data, total: data.length };
}

export async function createChannel(
  data: CreateChannelData
): Promise<{ data: Channel }> {
  if (!data.name?.trim()) throw new Error("NAME_REQUIRED");

  const channel = await chatRepository.createChannel({
    ...data,
    name: data.name.trim(),
  });

  return { data: channel };
}

export async function deleteChannel(
  id: number,
  workspaceId: number,
  userId: number
): Promise<{ success: boolean }> {
  const belongs = await chatRepository.channelBelongsToWorkspace(id, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const channel = await chatRepository.findChannelById(id);
  if (!channel) throw new Error("NOT_FOUND");

  if (channel.createdBy !== userId) throw new Error("FORBIDDEN");

  await chatRepository.deleteChannel(id);
  return { success: true };
}

// ── Channel Messages ──────────────────────────────────────────

export async function getChannelMessages(
  channelId: number,
  workspaceId: number
): Promise<ChannelMessageListResponse> {
  const belongs = await chatRepository.channelBelongsToWorkspace(channelId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  const data = await chatRepository.findChannelMessages(channelId);
  return { data, total: data.length };
}

export async function sendChannelMessage(
  channelId: number,
  workspaceId: number,
  data: Omit<SendChannelMessageData, "channelId">
): Promise<{ data: ChannelMessage }> {
  const belongs = await chatRepository.channelBelongsToWorkspace(channelId, workspaceId);
  if (!belongs) throw new Error("NOT_FOUND");

  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const message = await chatRepository.sendChannelMessage({
    channelId,
    authorId: data.authorId,
    content:  data.content.trim(),
  });

  return { data: message };
}

export async function deleteChannelMessage(
  messageId: number,
  userId: number
): Promise<{ success: boolean }> {
  const message = await chatRepository.findChannelMessageById(messageId);
  if (!message) throw new Error("NOT_FOUND");

  if (message.authorId !== userId) throw new Error("FORBIDDEN");

  await chatRepository.deleteChannelMessage(messageId);
  return { success: true };
}

// ── Direct Messages ───────────────────────────────────────────

export async function getDirectMessages(
  userId1: number,
  userId2: number,
  workspaceId: number
): Promise<DirectMessageListResponse> {
  const data = await chatRepository.findDirectMessages(userId1, userId2, workspaceId);
  return { data, total: data.length };
}

export async function sendDirectMessage(
  data: SendDirectMessageData
): Promise<{ data: DirectMessage }> {
  if (!data.content?.trim()) throw new Error("CONTENT_REQUIRED");

  const message = await chatRepository.sendDirectMessage({
    ...data,
    content: data.content.trim(),
  });

  return { data: message };
}

export async function deleteDirectMessage(
  messageId: number,
  userId: number
): Promise<{ success: boolean }> {
  const message = await chatRepository.findDirectMessageById(messageId);
  if (!message) throw new Error("NOT_FOUND");

  if (message.senderId !== userId) throw new Error("FORBIDDEN");

  await chatRepository.deleteDirectMessage(messageId);
  return { success: true };
}

// ── DM Users ──────────────────────────────────────────────────

export async function getWorkspaceMembers(
  workspaceId: number,
  excludeUserId: number
): Promise<DMUserListResponse> {
  const data = await chatRepository.findWorkspaceMembers(workspaceId, excludeUserId);
  return { data };
}