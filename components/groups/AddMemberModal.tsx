"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { GroupMember } from "@/types/group";

type WorkspaceMember = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

type Props = {
  workspaceId: number;
  groupId: number;
  existingMembers: GroupMember[];
  onAdd: (userId: number) => Promise<{ success: boolean }>;
  onClose: () => void;
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

function getGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

export default function AddMemberModal({
  workspaceId,
  groupId,
  existingMembers,
  onAdd,
  onClose,
}: Props) {
  const [members, setMembers]   = useState<WorkspaceMember[]>([]);
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState<number | null>(null);

  const existingIds = new Set(existingMembers.map((m) => m.userId));

  useEffect(() => {
    axios
      .get(`/api/workspaces/${workspaceId}/members`)
      .then((res) => setMembers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [workspaceId]);

  const filtered = members.filter(
    (m) =>
      !existingIds.has(m.id) &&
      (m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase()))
  );

  const handleAdd = async (userId: number) => {
    setAdding(userId);
    await onAdd(userId);
    setAdding(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(109,40,217,0.18)] ring-1 ring-violet-100">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">Add Members</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="13" y2="13" />
                <line x1="13" y1="2" x2="2" y2="13" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/10 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members..."
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="mt-3 max-h-72 overflow-y-auto px-3 pb-4 scrollbar-thin">
            {loading ? (
              <div className="space-y-2 px-3 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                {query ? "No members found" : "All workspace members are already in this group"}
              </div>
            ) : (
              filtered.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-violet-50"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: getGradient(member.name) }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleAdd(member.id)}
                    disabled={adding === member.id}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    {adding === member.id ? (
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
                      <>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}