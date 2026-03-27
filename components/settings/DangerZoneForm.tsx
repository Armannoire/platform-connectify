"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, LogOut, X } from "lucide-react";

type Props = {
  onDeleteAccount: () => Promise<{ success: boolean; error?: string }>;
  onLeaveWorkspace: () => Promise<{ success: boolean; error?: string }>;
};

type ConfirmModal = "delete" | "leave" | null;

export default function DangerZoneForm({ onDeleteAccount, onLeaveWorkspace }: Props) {
  const [confirm, setConfirm]   = useState<ConfirmModal>(null);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const CONFIRM_WORDS: Record<NonNullable<ConfirmModal>, string> = {
    delete: "DELETE",
    leave:  "LEAVE",
  };

  const handleAction = async () => {
    if (!confirm) return;
    if (input !== CONFIRM_WORDS[confirm]) return setError("Confirmation text doesn't match");

    setLoading(true);
    setError(null);

    const result = confirm === "delete"
      ? await onDeleteAccount()
      : await onLeaveWorkspace();

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong");
    }
  };

  const openConfirm = (type: ConfirmModal) => {
    setConfirm(type);
    setInput("");
    setError(null);
  };

  const closeConfirm = () => {
    setConfirm(null);
    setInput("");
    setError(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3 border-b border-red-50 pb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle size={15} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Danger Zone</h3>
            <p className="text-xs text-gray-400">Irreversible actions — proceed with caution</p>
          </div>
        </div>

        <div className="space-y-4">

          {/* Leave workspace */}
          <div className="flex items-start justify-between gap-6 rounded-xl border border-orange-100 bg-orange-50/40 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Leave Workspace</p>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                You will lose access to all workspace content. The workspace and its data will remain intact for other members.
              </p>
            </div>
            <button
              onClick={() => openConfirm("leave")}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-orange-600 transition-all hover:bg-orange-50 hover:border-orange-300"
            >
              <LogOut size={14} />
              Leave
            </button>
          </div>

          {/* Delete account */}
          <div className="flex items-start justify-between gap-6 rounded-xl border border-red-100 bg-red-50/40 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Delete Account</p>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                Permanently delete your account and all associated data. This action is irreversible and cannot be undone.
              </p>
            </div>
            <button
              onClick={() => openConfirm("delete")}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

        </div>
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={closeConfirm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)] ring-1 ring-red-100">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-50 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    {confirm === "delete" ? <Trash2 size={14} className="text-red-500" /> : <LogOut size={14} className="text-orange-500" />}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {confirm === "delete" ? "Delete Account" : "Leave Workspace"}
                  </h3>
                </div>
                <button onClick={closeConfirm} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                  {confirm === "delete"
                    ? "This will permanently delete your account and all data. This action cannot be undone."
                    : "You will lose access to all workspace content immediately."}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    Type <span className="font-bold text-gray-900">{CONFIRM_WORDS[confirm]}</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(null); }}
                    placeholder={CONFIRM_WORDS[confirm]}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-500/10"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                    <AlertTriangle size={13} /> {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-gray-50 px-6 py-4">
                <button onClick={closeConfirm} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100">
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={loading || input !== CONFIRM_WORDS[confirm]}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? (
                    <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</>
                  ) : confirm === "delete" ? (
                    <><Trash2 size={13} /> Delete Account</>
                  ) : (
                    <><LogOut size={13} /> Leave Workspace</>
                  )}
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}