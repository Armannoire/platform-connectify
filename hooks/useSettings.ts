"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

export function useSettings() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const router                = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await axios.get("/api/user/profile");
      setUser(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(data: { name?: string; email?: string }) {
    try {
      const res = await axios.patch("/api/user/profile", data);
      setUser(res.data.data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Failed to update profile" };
    }
  }

  async function updatePassword(data: { currentPassword: string; newPassword: string }) {
    try {
      await axios.patch("/api/user/password", data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Failed to update password" };
    }
  }

  async function updateAvatar(avatar: string) {
    try {
      const res = await axios.patch("/api/user/avatar", { avatar });
      setUser(res.data.data);
      useUserStore.getState().updateAvatar(avatar);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Failed to update avatar" };
    }
  }

  async function deleteAccount() {
    try {
      await axios.delete("/api/user/account");
      router.replace("/login");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Failed to delete account" };
    }
  }

  async function leaveWorkspace() {
    try {
      await axios.post("/api/user/leave-workspace");
      router.replace("/login");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Failed to leave workspace" };
    }
  }

  return {
    user,
    loading,
    error,
    updateProfile,
    updatePassword,
    updateAvatar,
    deleteAccount,
    leaveWorkspace,
    refetch: fetchProfile,
  };
}