"use client";

import { useRef, useState } from "react";
import { Camera, Check, AlertCircle } from "lucide-react";

type Props = {
  currentAvatar: string | null;
  name: string;
  onUpload: (avatar: string) => Promise<{ success: boolean; error?: string }>;
};

export default function AvatarUpload({ currentAvatar, name, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setError("Image must be under 2MB");
    setLoading(true); setError(null); setSuccess(false);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      const result = await onUpload(base64);
      setLoading(false);
      if (result.success) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
      else setError(result.error || "Failed to upload");
    };
    reader.readAsDataURL(file);
  };

  const avatar = preview || currentAvatar;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <Camera size={15} className="text-violet-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-xs text-gray-400">Upload a photo to personalize your account</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-violet-100" />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Upload button */}
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Camera size={15} className="text-gray-400" />
            {loading ? "Uploading..." : "Upload Photo"}
          </button>
          <p className="mt-2 text-xs text-gray-400">JPG, PNG up to 2MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 ring-1 ring-emerald-100">
          <Check size={14} /> Avatar updated successfully
        </div>
      )}
    </div>
  );
}