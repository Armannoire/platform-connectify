// types/chat.ts

export type Channel = {
  id: number;
  workspaceId: number;
  name: string;
  createdBy: number;
  createdAt: Date;
};

export type ChannelMessage = {
  id: number;
  channelId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: Date;
};

export type DirectMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  workspaceId: number;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  createdAt: Date;
};

export type DMUser = {
  id: number;
  name: string;
  avatar: string | null;
};

// POST bodies
export type CreateChannelData = {
  workspaceId: number;
  name: string;
  createdBy: number;
};

export type SendChannelMessageData = {
  channelId: number;
  authorId: number;
  content: string;
};

export type SendDirectMessageData = {
  senderId: number;
  receiverId: number;
  workspaceId: number;
  content: string;
};

// API responses
export type ChannelListResponse = {
  data: Channel[];
  total: number;
};

export type ChannelMessageListResponse = {
  data: ChannelMessage[];
  total: number;
};

export type DirectMessageListResponse = {
  data: DirectMessage[];
  total: number;
};

export type DMUserListResponse = {
  data: DMUser[];
};