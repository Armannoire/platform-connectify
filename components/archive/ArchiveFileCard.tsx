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

const categoryStyle = {
  documents: { bg: "bg-blue-50",   text: "text-blue-500",   ring: "ring-blue-100"   },
  images:    { bg: "bg-violet-50", text: "text-violet-500", ring: "ring-violet-100" },
  videos:    { bg: "bg-rose-50",   text: "text-rose-500",   ring: "ring-rose-100"   },
  other:     { bg: "bg-gray-50",   text: "text-gray-400",   ring: "ring-gray-100"   },
};

function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchiveFileCard({ file, currentUserId, onPreview, onDownload, onDelete }: Props) {
  const Icon  = categoryIcon[file.category] ?? File;
  const style = categoryStyle[file.category] ?? categoryStyle.other;

  const date = new Date(file.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      onClick={() => onPreview(file)}
      className="group flex cursor-pointer items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-black/[0.05] transition-all duration-150 hover:shadow-[0_4px_20px_rgba(109,40,217,0.08)] hover:ring-violet-200"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text} ring-1 ${style.ring}`}>
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatSize(file.size)} · {file.uploaderName} · {date}
          </p>
        </div>
      </div>

      <div
        className="ml-4 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onDownload(file.id, file.name)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-500"
          title="Download"
        >
          <Download size={14} />
        </button>
        {file.uploadedBy === currentUserId && (
          <button
            onClick={() => onDelete(file.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}