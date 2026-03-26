"use client";

import { useState, useEffect } from "react";
import { Download, X, FileText, File, Image, Video } from "lucide-react";
import type { ArchiveFile } from "@/hooks/useArchive";

type Props = {
  file: ArchiveFile;
  workspaceId: number;
  onDownload: (id: number, name: string) => void;
  onClose: () => void;
};

function formatSize(bytes: number): string {
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchivePreviewModal({ file, workspaceId, onDownload, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isImage    = file.category === "images";
  const isVideo    = file.category === "videos";
  const isPDF      = file.mimeType === "application/pdf";
  const isViewable = isImage || isVideo || isPDF;

  useEffect(() => {
    if (!isViewable) {
      setLoading(false);
      return;
    }

    fetch(`/api/workspaces/${workspaceId}/archive/${file.id}`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [file.id]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04]"
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                isImage ? "bg-purple-50 text-purple-600" :
                isVideo ? "bg-rose-50 text-rose-600" :
                isPDF   ? "bg-blue-50 text-blue-600" :
                          "bg-gray-100 text-gray-600"
              }`}>
                {isImage ? <Image size={16} /> :
                 isVideo ? <Video size={16} /> :
                 isPDF   ? <FileText size={16} /> :
                           <File size={16} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(file.size)} · {file.uploaderName}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 ml-4">
              <button
                onClick={() => onDownload(file.id, file.name)}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download size={14} />
                Download
              </button>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
              </div>
            ) : isImage && blobUrl ? (
              <div className="flex items-center justify-center p-6">
                <img
                  src={blobUrl}
                  alt={file.name}
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-sm"
                />
              </div>
            ) : isVideo && blobUrl ? (
              <div className="flex items-center justify-center p-6">
                <video
                  src={blobUrl}
                  controls
                  className="max-h-[70vh] max-w-full rounded-xl shadow-sm"
                />
              </div>
            ) : isPDF && blobUrl ? (
              <iframe
                src={blobUrl}
                className="h-[70vh] w-full rounded-b-2xl border-0"
                title={file.name}
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <File size={28} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Preview not available</p>
                <p className="mt-1 text-xs text-gray-400">Download the file to view its contents</p>
                <button
                  onClick={() => onDownload(file.id, file.name)}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}