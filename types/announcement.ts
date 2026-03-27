// types/announcement.types.ts

export type Announcement = {
  id: number;
  workspaceId: number;
  authorId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AnnouncementWithAuthor = Announcement & {
  authorName: string;
  authorAvatar: string | null;
  reactions?: ReactionSummary[];
};

// POST body
export type CreateAnnouncementData = {
  workspaceId: number;
  authorId: number;
  title: string;
  content: string;
};

// PATCH body 
export type UpdateAnnouncementData = {
  title?: string;
  content?: string;
};

// API response — list
export type AnnouncementListResponse = {
  data: AnnouncementWithAuthor[];
  total: number;
};

// API response — single
export type AnnouncementResponse = {
  data: AnnouncementWithAuthor;
};
export type AnnouncementReaction = {
  id: number;
  announcementId: number;
  userId: number;
  userName: string;
  emoji: string;
  createdAt: Date;
};

export type AnnouncementComment = {
  id: number;
  announcementId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  parentId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: AnnouncementComment[];
};

export type ReactionSummary = {
  emoji: string;
  count: number;
  userIds: number[];
};

// POST bodies
export type AddReactionData = {
  announcementId: number;
  userId: number;
  emoji: string;
};

export type CreateCommentData = {
  announcementId: number;
  authorId: number;
  parentId?: number;
  content: string;
};

export type UpdateCommentData = {
  content: string;
};

// API responses
export type AnnouncementCommentsResponse = {
  data: AnnouncementComment[];
  total: number;
};

export type AnnouncementReactionsResponse = {
  data: ReactionSummary[];
};