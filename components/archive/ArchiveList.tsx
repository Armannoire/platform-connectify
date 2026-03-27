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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-100 bg-violet-50/30 py-20 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "linear-gradient(135deg, #667eea22, #764ba222)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">No files yet</p>
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