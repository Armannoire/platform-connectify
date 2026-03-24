export type Group = {
  id: number;
  workspaceId: number;
  createdBy: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GroupWithMembers = Group & {
  members: GroupMember[];
  memberCount: number;
};

export type GroupMember = {
  userId: number;
  name: string;
  avatar: string | null;
  joinedAt: Date;
};

export type GroupMessage = {
  id: number;
  groupId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: Date;
};

// POST body
export type CreateGroupData = {
  workspaceId: number;
  createdBy: number;
  name: string;
  description?: string;
};

export type UpdateGroupData = {
  name?: string;
  description?: string;
};

export type SendMessageData = {
  groupId: number;
  authorId: number;
  content: string;
};

// API responses
export type GroupListResponse = {
  data: GroupWithMembers[];
  total: number;
};

export type GroupResponse = {
  data: GroupWithMembers;
};

export type GroupMessageListResponse = {
  data: GroupMessage[];
  total: number;
};