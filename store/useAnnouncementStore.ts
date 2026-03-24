import { create } from "zustand";
import type { AnnouncementWithAuthor } from "@/types/announcement.ts";

type AnnouncementState = {
  announcements: AnnouncementWithAuthor[];
  total: number;
  loading: boolean;
  error: string | null;

  setAnnouncements: (data: AnnouncementWithAuthor[], total: number) => void;
  addAnnouncement: (announcement: AnnouncementWithAuthor) => void;
  updateAnnouncement: (updated: AnnouncementWithAuthor) => void;
  removeAnnouncement: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  total: 0,
  loading: false,
  error: null,

 setAnnouncements: (data, total) => set({ announcements: data, total }),
  addAnnouncement: (a) => set((s) => ({
    announcements: [a, ...s.announcements],
    total: s.total + 1,
  })),
  updateAnnouncement: (updated) => set((s) => ({
    announcements: s.announcements.map((a) => a.id === updated.id ? updated : a),
  })),
  removeAnnouncement: (id) => set((s) => ({
    announcements: s.announcements.filter((a) => a.id !== id),
    total: s.total - 1,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
 }))