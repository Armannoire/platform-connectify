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
};

// POST body
export type CreateAnnouncementData = {
  workspaceId: number;
  authorId: number;
  title: string;
  content: string;
};

// PATCH body — բոլոր դաշտերը optional
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