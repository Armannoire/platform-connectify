"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import type { AnnouncementWithAuthor, UpdateAnnouncementData } from "@/types/announcement.ts";

type Props = {
  announcement: AnnouncementWithAuthor;
  onSubmit: (data: UpdateAnnouncementData) => Promise<{ success: boolean }>;
  onClose: () => void;
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-500/10";

export default function AnnouncementEditor({ announcement, onSubmit, onClose }: Props) {
  const [title, setTitle]     = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
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

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Announcement</h2>
            <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Title</label>
              <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setError(null); }} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Content</label>
              <textarea value={content} onChange={(e) => { setContent(e.target.value); setError(null); }} rows={5} className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onClose} className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {loading ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</> : <><Check size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}