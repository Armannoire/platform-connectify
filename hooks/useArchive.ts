"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export type ArchiveFile = {
  id: number;
  workspaceId: number;
  uploadedBy: number;
  uploaderName: string;
  name: string;
  category: "documents" | "images" | "videos" | "other";
  mimeType: string;
  size: number;
  createdAt: Date;
};

export function useArchive(workspaceId: number) {
  const [files, setFiles]       = useState<ArchiveFile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    fetchFiles();
  }, [workspaceId, category]);

  async function fetchFiles() {
    setLoading(true);
    setError(null);
    try {
      const url = category === "all"
        ? `/api/workspaces/${workspaceId}/archive`
        : `/api/workspaces/${workspaceId}/archive?category=${category}`;

      const res = await axios.get(url);
      setFiles(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file: File) {
    try {
      const base64 = await fileToBase64(file);

      const res = await axios.post(`/api/workspaces/${workspaceId}/archive`, {
        name:     file.name,
        mimeType: file.type,
        size:     file.size,
        data:     base64,
      });

      setFiles((prev) => [res.data.data, ...prev]);
      setError(null);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to upload file");
      return { success: false };
    }
  }

  async function downloadFile(fileId: number, fileName: string) {
    try {
      const res = await axios.get(
        `/api/workspaces/${workspaceId}/archive/${fileId}`,
        { responseType: "blob" }
      );

      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setError(null);

      return { success: true };
    } catch {
      setError("Failed to download file");
      return { success: false };
    }
  }

  async function deleteFile(fileId: number) {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}/archive/${fileId}`);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setError(null);
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete file");
      return { success: false };
    }
  }

  return {
    files,
    loading,
    error,
    category,
    setCategory,
    uploadFile,
    downloadFile,
    deleteFile,
    refetch: fetchFiles,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}