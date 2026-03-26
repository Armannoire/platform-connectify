// store/useUserStore.ts
import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  updateAvatar: (avatar: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateAvatar: (avatar) => set((s) => ({
    user: s.user ? { ...s.user, avatar } : null,
  })),
}));