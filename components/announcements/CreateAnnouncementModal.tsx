"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

type Props = {
  onSubmit: (data: { title: string; content: string }) => Promise<{ success: boolean }>;
  onClose: () => void;
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.08]";

export default function CreateAnnouncementModal({ onSubmit, onClose }: Props) {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim())   return setError("Title is required");
    if (!content.trim()) return setError("Content is required");
    setLoading(true); setError(null);
    const result = await onSubmit({ title, content });
    setLoading(false);
    if (result.success) onClose();
    else setError("Something went wrong. Please try again.");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04]">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">New Announcement</h2>
              <p className="mt-0.5 text-xs text-gray-400">Share an update with your workspace</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(null); }}
                placeholder="Announcement title..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setError(null); }}
                placeholder="Write your announcement..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {loading
                ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Publishing...</>
                : <><Check size={14} /> Publish</>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
}