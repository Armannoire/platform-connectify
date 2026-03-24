"use client";

import { useState, useEffect } from "react";

type Props = {
  name: string;
  email: string;
  onSubmit: (data: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
};

export default function ProfileForm({ name, email, onSubmit }: Props) {
  const [nameVal, setNameVal]   = useState(name);
  const [emailVal, setEmailVal] = useState(email);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    setNameVal(name);
    setEmailVal(email);
  }, [name, email]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    const result = await onSubmit({ name: nameVal, email: emailVal });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
      <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
      <p className="mt-1 text-sm text-gray-500">Update your name and email address</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={nameVal}
            onChange={(e) => { setNameVal(e.target.value); setError(null); }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={emailVal}
            onChange={(e) => { setEmailVal(e.target.value); setError(null); }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600 ring-1 ring-emerald-100">
          Profile updated successfully
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}