"use client";

import { Download, Trash2, FileText, Image, Video, File } from "lucide-react";
import type { ArchiveFile } from "@/hooks/useArchive";

type Props = {
  file: ArchiveFile;
  currentUserId: number;
  onPreview: (file: ArchiveFile) => void;
  onDownload: (id: number, name: string) => void;
  onDelete: (id: number) => void;
};

const categoryIcon = {
  documents: FileText,
  images:    Image,
  videos:    Video,
  other:     File,
};

const categoryColor = {
  documents: "bg-blue-50 text-blue-600",
  images:    "bg-purple-50 text-purple-600",
  videos:    "bg-rose-50 text-rose-600",
  other:     "bg-gray-50 text-gray-600",
};

function formatSize(bytes: number): string {
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchiveFileCard({ file, currentUserId, onPreview, onDownload, onDelete }: Props) {
  const Icon  = categoryIcon[file.category];
  const color = categoryColor[file.category];

  const date = new Date(file.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  return (
    <div
      onClick={() => onPreview(file)}
      className="group flex cursor-pointer items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md hover:ring-black/[0.08]"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{file.name}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatSize(file.size)} · {file.uploaderName} · {date}
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onDownload(file.id, file.name)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          title="Download"
        >
          <Download size={15} />
        </button>
        {file.uploadedBy === currentUserId && (
          <button
            onClick={() => onDelete(file.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}