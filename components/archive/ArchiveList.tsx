"use client";

import type { ArchiveFile } from "@/hooks/useArchive";
import ArchiveFileCard from "./ArchiveFileCard";

type Props = {
  files: ArchiveFile[];
  currentUserId: number;
  onPreview: (file: ArchiveFile) => void;
  onDownload: (id: number, name: string) => void;
  onDelete: (id: number) => void;
};

export default function ArchiveList({ files, currentUserId, onPreview, onDownload, onDelete }: Props) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="mb-4 text-5xl">📁</div>
        <p className="text-sm font-medium text-gray-900">No files yet</p>
        <p className="mt-1 text-xs text-gray-400">Upload your first file to the archive</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <ArchiveFileCard
          key={file.id}
          file={file}
          currentUserId={currentUserId}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}