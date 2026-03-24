"use client";

import { useEffect } from "react";
import axios from "axios";
import { useGroupStore } from "@/store/useGroupStore";
import type { UpdateGroupData } from "@/types/group";

export function useGroups(workspaceId: number) {
  const {
    groups,
    total,
    loading,
    error,
    setGroups,
    addGroup,
    updateGroup,
    removeGroup,
    setLoading,
    setError,
  } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [workspaceId]);

  async function fetchGroups() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/workspaces/${workspaceId}/groups`);
      setGroups(res.data.data, res.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  async function createGroup(data: { name: string; description?: string }) {
    try {
      const res = await axios.post(`/api/workspaces/${workspaceId}/groups`, data);
      addGroup(res.data.data);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create group");
      return { success: false };
    }
  }

  async function editGroup(id: number, data: UpdateGroupData) {
    try {
      const res = await axios.patch(`/api/workspaces/${workspaceId}/groups/${id}`, data);
      updateGroup(res.data.data);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update group");
      return { success: false };
    }
  }

  async function deleteGroup(id: number) {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/groups/${id}`);
      removeGroup(id);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete group");
      return { success: false };
    }
  }

  async function addMember(groupId: number, userId: number) {
    try {
      await axios.post(`/api/workspaces/${workspaceId}/groups/${groupId}/members`, { userId });
      await fetchGroups();
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add member");
      return { success: false };
    }
  }

  async function removeMember(groupId: number, userId: number) {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/groups/${groupId}/members`, { data: { userId } });
      await fetchGroups();
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to remove member");
      return { success: false };
    }
  }

  return {
    groups,
    total,
    loading,
    error,
    createGroup,
    editGroup,
    deleteGroup,
    addMember,
    removeMember,
    refetch: fetchGroups,
  };
}