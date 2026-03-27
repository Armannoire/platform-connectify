"use client";

import { useState } from "react";
import type { GroupWithMembers, UpdateGroupData } from "@/types/group";
import AddMemberModal from "./AddMemberModal";

type Props = {
  group: GroupWithMembers;
  workspaceId: number;
  currentUserId: number;
  onEdit: (data: UpdateGroupData) => Promise<{ success: boolean }>;
  onDelete: () => void;
  onAddMember: (userId: number) => Promise<{ success: boolean }>;
  onRemoveMember: (userId: number) => Promise<{ success: boolean }>;
  onClose: () => void;
  onRefetch: () => void;
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

type Tab = "members" | "info";

export default function GroupDetailModal({
  group,
  workspaceId,
  currentUserId,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,
  onClose,
  onRefetch,
}: Props) {
  const [tab, setTab]               = useState<Tab>("members");
  const [showAddMember, setShowAddMember] = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [name, setName]             = useState(group.name);
  const [description, setDescription] = useState(group.description ?? "");
  const [saving, setSaving]         = useState(false);
  const [removing, setRemoving]     = useState<number | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const isOwner = group.createdBy === currentUserId;

  const handleSave = async () => {
    if (!name.trim()) return setError("Name is required");
    setSaving(true);
    setError(null);
    const result = await onEdit({ name, description: description.trim() || undefined });
    setSaving(false);
    if (result.success) {
      setEditMode(false);
      onRefetch();
    } else {
      setError("Failed to update group");
    }
  };

  const handleRemove = async (userId: number) => {
    setRemoving(userId);
    await onRemoveMember(userId);
    setRemoving(null);
    onRefetch();
  };

  const handleAddMember = async (userId: number) => {
    const result = await onAddMember(userId);
    if (result.success) onRefetch();
    return result;
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(109,40,217,0.18)] ring-1 ring-violet-100">

          {/* Header */}
          <div
            className="relative px-6 py-6"
            style={{ background: "linear-gradient(135deg, #667eea18, #764ba210)" }}
          >
            <div className="flex items-start gap-4">
              {/* Group avatar */}
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
                style={{ background: getGradient(group.name) }}
              >
                {group.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    className="w-full rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-violet-500/20"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-lg font-bold text-gray-900 truncate">{group.name}</h2>
                )}
                <p className="mt-0.5 text-sm text-gray-400">
                  {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isOwner && !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-violet-500"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="2" y1="2" x2="13" y2="13" />
                    <line x1="13" y1="2" x2="2" y2="13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Description edit */}
            {editMode && (
              <div className="mt-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Group description (optional)"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-500/20 placeholder:text-gray-400"
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => { setEditMode(false); setName(group.name); setDescription(group.description ?? ""); }}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {/* Description display */}
            {!editMode && group.description && (
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{group.description}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {(["members", "info"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px mr-6 py-3 text-sm font-medium transition-all border-b-2 capitalize ${
                  tab === t
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "members" ? `Members (${group.memberCount})` : "Info"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-h-72 overflow-y-auto">

            {/* Members tab */}
            {tab === "members" && (
              <div className="p-4">
                {/* Add member button */}
                {isOwner && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 py-2.5 text-sm font-medium text-violet-500 transition-colors hover:border-violet-400 hover:bg-violet-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Member
                  </button>
                )}

                {/* Members list */}
                <div className="space-y-1">
                  {group.members.map((member) => {
                    const isCreator = member.userId === group.createdBy;
                    const canRemove = isOwner && member.userId !== currentUserId;

                    return (
                      <div
                        key={member.userId}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                          style={{ background: getGradient(member.name) }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                            {isCreator && (
                              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                                Owner
                              </span>
                            )}
                          </div>
                        </div>

                        {canRemove && (
                          <button
                            onClick={() => handleRemove(member.userId)}
                            disabled={removing === member.userId}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
                          >
                            {removing === member.userId ? (
                              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info tab */}
            {tab === "info" && (
              <div className="p-6 space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-900">{group.name}</p>
                </div>
                {group.description && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Members</p>
                  <p className="text-sm font-medium text-gray-900">{group.memberCount}</p>
                </div>
                {isOwner && (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={onDelete}
                      className="flex items-center gap-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                      Delete Group
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          workspaceId={workspaceId}
          groupId={group.id}
          existingMembers={group.members}
          onAdd={handleAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}
    </>
  );
}