"use client";

import { useState, useRef } from "react";
import { Upload, X, File } from "lucide-react";

type Props = {
  onUpload: (file: File) => Promise<{ success: boolean }>;
  onClose: () => void;
};

const MAX_SIZE = 100 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchiveUploadModal({ onUpload, onClose }: Props) {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE) return setError("File must be under 100MB");
    setFile(f);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a file");
    setLoading(true);
    const result = await onUpload(file);
    setLoading(false);
    if (result.success) onClose();
    else setError("Upload failed. Please try again.");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(109,40,217,0.15)] ring-1 ring-violet-100">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                <Upload size={14} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Upload File</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                {error}
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-150 ${
                dragging
                  ? "border-violet-400 bg-violet-50/50"
                  : "border-violet-100 hover:border-violet-300 hover:bg-violet-50/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />

              {file ? (
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg, #667eea22, #764ba222)" }}
                  >
                    <File size={20} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: "linear-gradient(135deg, #667eea22, #764ba222)" }}
                  >
                    <Upload size={20} className="text-violet-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drop file here or <span className="text-violet-500">browse</span></p>
                  <p className="mt-1 text-xs text-gray-400">Max file size 100MB</p>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Uploading...
                </span>
              ) : "Upload"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}