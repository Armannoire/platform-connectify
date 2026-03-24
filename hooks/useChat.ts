"use client";

import { useEffect, useCallback } from "react";
import axios from "axios";
import { useChatStore } from "@/store/useChatStore";
import { getSocket } from "@/lib/socket";
import type { ChannelMessage, DirectMessage } from "@/types/chat";

export function useChat(workspaceId: number, currentUserId: number) {
  const {
    channels, activeChannelId, channelMessages,
    dmUsers, activeDMUserId, directMessages,
    loading, messagesLoading, error,
    setChannels, addChannel, removeChannel, setActiveChannel,
    setChannelMessages, addChannelMessage, removeChannelMessage,
    setDMUsers, setActiveDMUser, setDirectMessages,
    addDirectMessage, removeDirectMessage,
    setLoading, setMessagesLoading, setError,
  } = useChatStore();

  const socket = getSocket();

  // ── Init ──────────────────────────────────────────────────

  useEffect(() => {
    fetchChannels();
    fetchDMUsers();

    socket.on("message:channel", (message: ChannelMessage) => {
      if (message.authorId !== currentUserId) {
        addChannelMessage(message);
      }
    });

    socket.on("message:dm", (message: DirectMessage) => {
      if (message.senderId !== currentUserId) {
        addDirectMessage(message);
      }
    });

    return () => {
      socket.off("message:channel");
      socket.off("message:dm");
    };
  }, [workspaceId]);

  // ── Channels ──────────────────────────────────────────────

  async function fetchChannels() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/channels`);
      setChannels(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }

  async function createChannel(name: string) {
    try {
      const res = await axios.post(`/api/workspaces/${workspaceId}/channels`, { name });
      addChannel(res.data.data);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create channel");
      return { success: false };
    }
  }

  async function deleteChannel(channelId: number) {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/channels/${channelId}`);
      removeChannel(channelId);
      if (activeChannelId === channelId) setActiveChannel(null);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete channel");
      return { success: false };
    }
  }

  const selectChannel = useCallback(async (channelId: number) => {
    if (activeChannelId) socket.emit("leave:channel", activeChannelId);

    setActiveChannel(channelId);
    setMessagesLoading(true);

    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/channels/${channelId}/messages`);
      setChannelMessages(res.data.data);
      socket.emit("join:channel", channelId);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  }, [activeChannelId, workspaceId]);

  async function sendChannelMessage(content: string) {
    if (!activeChannelId) return { success: false };
    try {
      const res = await axios.post(
        `/api/workspaces/${workspaceId}/channels/${activeChannelId}/messages`,
        { content }
      );
      addChannelMessage(res.data.data);
      socket.emit("message:channel", {
        channelId: activeChannelId,
        message: res.data.data,
      });
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send message");
      return { success: false };
    }
  }

  async function deleteChannelMessage(messageId: number) {
    if (!activeChannelId) return { success: false };
    try {
      await axios.delete(
        `/api/workspaces/${workspaceId}/channels/${activeChannelId}/messages/${messageId}`
      );
      removeChannelMessage(messageId);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete message");
      return { success: false };
    }
  }

  // ── Direct Messages ───────────────────────────────────────

  async function fetchDMUsers() {
    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/dm`);
      setDMUsers(res.data.data);
    } catch {}
  }

  const selectDMUser = useCallback(async (userId: number) => {
    const roomId = [currentUserId, userId].sort().join("-");
    setActiveDMUser(userId);
    setMessagesLoading(true);

    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/dm/${userId}`);
      setDirectMessages(res.data.data);
      socket.emit("join:dm", roomId);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUserId, workspaceId]);

  async function sendDirectMessage(content: string) {
    if (!activeDMUserId) return { success: false };
    const roomId = [currentUserId, activeDMUserId].sort().join("-");
    try {
      const res = await axios.post(
        `/api/workspaces/${workspaceId}/dm/${activeDMUserId}`,
        { content }
      );
      addDirectMessage(res.data.data);
      socket.emit("message:dm", {
        roomId,
        message: res.data.data,
      });
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send message");
      return { success: false };
    }
  }

  async function deleteDirectMessage(messageId: number) {
    if (!activeDMUserId) return { success: false };
    try {
      await axios.delete(
        `/api/workspaces/${workspaceId}/dm/${activeDMUserId}/${messageId}`
      );
      removeDirectMessage(messageId);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete message");
      return { success: false };
    }
  }

  return {
    channels, activeChannelId, channelMessages,
    dmUsers, activeDMUserId, directMessages,
    loading, messagesLoading, error,
    createChannel, deleteChannel, selectChannel,
    sendChannelMessage, deleteChannelMessage,
    selectDMUser, sendDirectMessage, deleteDirectMessage,
  };
}