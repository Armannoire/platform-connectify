"use client"

import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import type {
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "@/types/announcement.ts";
import axios from "axios";
import { useEffect } from "react";

export function useAnnouncements(workspaceId: number) {
    const {
        announcements,
        total,
        loading,
        error,
        setAnnouncements,
        addAnnouncement,
        updateAnnouncement,
        removeAnnouncement,
        setLoading,
        setError,
    } = useAnnouncementStore();

    useEffect(() => {
        fetchAnnouncements();
    },[workspaceId])

    async function fetchAnnouncements() {
       setLoading(true);
       setError(null);
       try {
            const res = await axios.get(`/api/workspaces/${workspaceId}/announcements`);
            setAnnouncements(res.data.data, res.data.total);      
       } catch (err: any){
            setError(err.response?.data?.error || "Failed to load announcements");
       } finally {
            setLoading(false)
       }
    }

    async function createAnnouncement(data: { title: string; content: string }) {
        try {
            const res = await axios.post(`/api/workspaces/${workspaceId}/announcements`, data)
            addAnnouncement(res.data.data);
            return {success: true};
        } catch (err: any){
            setError(err.response?.data?.error ||  "Failed to create announcement")
            return {success: false}
        } 
    }

    async function editAnnouncement(id: number, data: UpdateAnnouncementData) {
    try {
      const res = await axios.patch(`/api/workspaces/${workspaceId}/announcements/${id}`, data);
      updateAnnouncement(res.data.data);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update announcement");
      return { success: false };
    }
  }

  async function deleteAnnouncement(id: number) {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/announcements/${id}`);
      removeAnnouncement(id);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete announcement");
      return { success: false };
    }
  }

  return {
    announcements,
    total,
    loading,
    error,
    createAnnouncement,
    editAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements,
  }
}

