"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useArchive } from "@/hooks/useArchive";
import type { ArchiveFile } from "@/hooks/useArchive";
import ArchiveList from "@/components/archive/ArchiveList";
import ArchiveUploadModal from "@/components/archive/ArchiveUploadModal";
import ArchivePreviewModal from "@/components/archive/ArchivePreviewModal";
import { Upload } from "lucide-react";

const CATEGORIES = [
  { id: "all",       label: "All Files"  },
  { id: "documents", label: "Documents"  },
  { id: "images",    label: "Images"     },
  { id: "videos",    label: "Videos"     },
  { id: "other",     label: "Other"      },
];

export default function ArchivePage() {
  const { workspaceId } = useParams();
  const {
    files, loading, error,
    category, setCategory,
    uploadFile, downloadFile, deleteFile,
  } = useArchive(Number(workspaceId));

  const [showUpload, setShowUpload] = useState(false);
  const [previewFile, setPreviewFile] = useState<ArchiveFile | null>(null);

  // TODO: replace with real session
  const currentUserId = 1;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archive</h1>
          <p className="mt-1 text-sm text-gray-400">
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} stored` : "Store and manage your files"}
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <Upload size={14} />
          Upload File
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-100">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-all ${
              category === id
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.04]" />
          ))}
        </div>
      ) : (
        <ArchiveList
          files={files}
          currentUserId={currentUserId}
          onPreview={setPreviewFile}
          onDownload={downloadFile}
          onDelete={deleteFile}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <ArchiveUploadModal
          onUpload={uploadFile}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Preview Modal */}
      {previewFile && (
        <ArchivePreviewModal
          file={previewFile}
          workspaceId={Number(workspaceId)}
          onDownload={downloadFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}