"use client";

import { useRef, useState } from "react";

type Props = {
  currentAvatar: string | null;
  name: string;
  onUpload: (avatar: string) => Promise<{ success: boolean; error?: string }>;
};

export default function AvatarUpload({ currentAvatar, name, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return setError("Image must be under 2MB");
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const result = await onUpload(base64);
      setLoading(false);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to upload");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
      <h3 className="text-base font-semibold text-gray-900">Profile Picture</h3>
      <p className="mt-1 text-sm text-gray-500">Upload a photo to personalize your account</p>

      <div className="mt-6 flex items-center gap-5">
        {/* Avatar preview */}
        <div className="relative">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={name}
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/[0.06]"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-xl font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Photo"}
          </button>
          <p className="mt-1.5 text-xs text-gray-400">JPG, PNG up to 2MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600 ring-1 ring-emerald-100">
          Avatar updated successfully
        </div>
      )}
    </div>
  );
}