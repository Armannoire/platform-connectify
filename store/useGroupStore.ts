import { create } from "zustand";
import type { GroupWithMembers } from "@/types/group";

type GroupState = {
  groups: GroupWithMembers[];
  total: number;
  loading: boolean;
  error: string | null;

  setGroups: (data: GroupWithMembers[], total: number) => void;
  addGroup: (group: GroupWithMembers) => void;
  updateGroup: (updated: GroupWithMembers) => void;
  removeGroup: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  total: 0,
  loading: false,
  error: null,

  setGroups: (data, total) => set({ groups: data, total }),
  addGroup: (g) => set((s) => ({
    groups: [g, ...s.groups],
    total: s.total + 1,
  })),
  updateGroup: (updated) => set((s) => ({
    groups: s.groups.map((g) => g.id === updated.id ? updated : g),
  })),
  removeGroup: (id) => set((s) => ({
    groups: s.groups.filter((g) => g.id !== id),
    total: s.total - 1,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));