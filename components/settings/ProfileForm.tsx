"use client";

import { useState, useEffect, useRef } from "react";
import { Check, AlertCircle, User, Camera } from "lucide-react";

type Props = {
  name: string;
  email: string;
  currentAvatar: string | null;
  onSubmit: (data: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  onUpload: (avatar: string) => Promise<{ success: boolean; error?: string }>;
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.08]";

export default function ProfileForm({ name, email, currentAvatar, onSubmit, onUpload }: Props) {
  const [nameVal, setNameVal]   = useState(name);
  const [emailVal, setEmailVal] = useState(email);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const [preview, setPreview]         = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setNameVal(name); setEmailVal(email); }, [name, email]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setError("Image must be under 2MB");
    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      await onUpload(base64);
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError(null); setSuccess(false); setLoading(true);
    const result = await onSubmit({ name: nameVal, email: emailVal });
    setLoading(false);
    if (result.success) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else setError(result.error || "Something went wrong");
  };

  const avatar = preview || currentAvatar;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <User size={15} className="text-violet-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-400">Update your profile details</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-5 rounded-xl bg-gray-50 p-4">
        <div className="relative shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-violet-100" />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={avatarLoading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Camera size={13} className="text-gray-400" />
            {avatarLoading ? "Uploading..." : "Change Photo"}
          </button>
          <p className="mt-1.5 text-[10px] text-gray-400">JPG, PNG up to 2MB</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Full Name</label>
          <input type="text" value={nameVal} onChange={(e) => { setNameVal(e.target.value); setError(null); }} className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
          <input type="email" value={emailVal} onChange={(e) => { setEmailVal(e.target.value); setError(null); }} className={inputClass} placeholder="your@email.com" />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 ring-1 ring-emerald-100">
          <Check size={14} /> Profile updated successfully
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          {loading
            ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
            : <><Check size={14} /> Save Changes</>
          }
        </button>
      </div>
    </div>
  );
}