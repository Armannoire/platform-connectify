import { create } from "zustand";
import type { Channel, ChannelMessage, DirectMessage, DMUser } from "@/types/chat";

type ChatState = {
  // Channels
  channels: Channel[];
  activeChannelId: number | null;
  channelMessages: ChannelMessage[];

  // DM
  dmUsers: DMUser[];
  activeDMUserId: number | null;
  directMessages: DirectMessage[];

  // UI
  loading: boolean;
  messagesLoading: boolean;
  error: string | null;

  // Channel actions
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (id: number) => void;
  setActiveChannel: (id: number | null) => void;
  setChannelMessages: (messages: ChannelMessage[]) => void;
  addChannelMessage: (message: ChannelMessage) => void;
  removeChannelMessage: (id: number) => void;

  // DM actions
  setDMUsers: (users: DMUser[]) => void;
  setActiveDMUser: (id: number | null) => void;
  setDirectMessages: (messages: DirectMessage[]) => void;
  addDirectMessage: (message: DirectMessage) => void;
  removeDirectMessage: (id: number) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setMessagesLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  channels: [],
  activeChannelId: null,
  channelMessages: [],
  dmUsers: [],
  activeDMUserId: null,
  directMessages: [],
  loading: false,
  messagesLoading: false,
  error: null,

  setChannels: (channels) => set({ channels }),
  addChannel: (channel) => set((s) => ({ channels: [...s.channels, channel] })),
  removeChannel: (id) => set((s) => ({ channels: s.channels.filter((c) => c.id !== id) })),
  setActiveChannel: (id) => set({ activeChannelId: id, activeDMUserId: null }),
  setChannelMessages: (messages) => set({ channelMessages: messages }),
  addChannelMessage: (message) => set((s) => ({ channelMessages: [...s.channelMessages, message] })),
  removeChannelMessage: (id) => set((s) => ({ channelMessages: s.channelMessages.filter((m) => m.id !== id) })),

  setDMUsers: (users) => set({ dmUsers: users }),
  setActiveDMUser: (id) => set({ activeDMUserId: id, activeChannelId: null }),
  setDirectMessages: (messages) => set({ directMessages: messages }),
  addDirectMessage: (message) => set((s) => ({ directMessages: [...s.directMessages, message] })),
  removeDirectMessage: (id) => set((s) => ({ directMessages: s.directMessages.filter((m) => m.id !== id) })),

  setLoading: (loading) => set({ loading }),
  setMessagesLoading: (loading) => set({ messagesLoading: loading }),
  setError: (error) => set({ error }),
}));