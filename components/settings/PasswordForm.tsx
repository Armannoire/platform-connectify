"use client";

import { useState } from "react";
import { Check, AlertCircle, Lock } from "lucide-react";

type Props = {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/[0.08]";

export default function PasswordForm({ onSubmit }: Props) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null); setSuccess(false);
    if (newPass !== confirm) return setError("Passwords do not match");
    if (newPass.length < 6)  return setError("Minimum 6 characters required");
    setLoading(true);
    const result = await onSubmit({ currentPassword: current, newPassword: newPass });
    setLoading(false);
    if (result.success) {
      setCurrent(""); setNewPass(""); setConfirm("");
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } else setError(result.error || "Something went wrong");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <Lock size={15} className="text-violet-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
          <p className="text-xs text-gray-400">Keep your account safe with a strong password</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: "Current Password", value: current, set: setCurrent, placeholder: "Enter current password" },
          { label: "New Password",     value: newPass, set: setNewPass, placeholder: "Minimum 6 characters"   },
          { label: "Confirm Password", value: confirm, set: setConfirm, placeholder: "Repeat new password"    },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</label>
            <input type="password" value={value} onChange={(e) => { set(e.target.value); setError(null); }} className={inputClass} placeholder={placeholder} />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 ring-1 ring-emerald-100">
          <Check size={14} /> Password updated successfully
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          {loading ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Updating...</> : <><Lock size={14} /> Update Password</>}
        </button>
      </div>
    </div>
  );
}