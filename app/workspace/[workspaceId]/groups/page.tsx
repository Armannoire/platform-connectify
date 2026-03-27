"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import GroupsList from "@/components/groups/GroupsList";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import GroupEditor from "@/components/groups/GroupEditor";
import GroupDetailModal from "@/components/groups/GroupDetailModal";
import type { GroupWithMembers } from "@/types/group";

export default function GroupsPage() {
  const { workspaceId } = useParams();
  const wId = Number(workspaceId);

  const {
    groups,
    loading,
    error,
    createGroup,
    editGroup,
    deleteGroup,
    addMember,
    removeMember,
    refetch,
  } = useGroups(wId);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing]       = useState<GroupWithMembers | null>(null);
  const [selected, setSelected]     = useState<GroupWithMembers | null>(null);

  // TODO: replace with real session
  const currentUserId = 1;

  const handleDelete = async (id: number) => {
    await deleteGroup(id);
    if (selected?.id === id) setSelected(null);
  };

  const handleRefetch = async () => {
    await refetch();
    if (selected) {
      const updated = groups.find((g) => g.id === selected.id);
      if (updated) setSelected(updated);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="mt-1 text-sm text-gray-400">
            {groups.length > 0
              ? `${groups.length} group${groups.length > 1 ? "s" : ""} in your workspace`
              : "Organize your workspace members into groups"}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Group
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.04]" />
          ))}
        </div>
      ) : (
        <GroupsList
          groups={groups}
          currentUserId={currentUserId}
          onDelete={handleDelete}
          onEdit={setEditing}
          onSelect={setSelected}
        />
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateGroupModal
          onSubmit={createGroup}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <GroupEditor
          group={editing}
          onSubmit={(data) => editGroup(editing.id, data)}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Detail Modal */}
      {selected && (
        <GroupDetailModal
          group={selected}
          workspaceId={wId}
          currentUserId={currentUserId}
          onEdit={(data) => editGroup(selected.id, data)}
          onDelete={() => handleDelete(selected.id)}
          onAddMember={(userId) => addMember(selected.id, userId)}
          onRemoveMember={(userId) => removeMember(selected.id, userId)}
          onClose={() => setSelected(null)}
          onRefetch={handleRefetch}
        />
      )}
    </>
  );
}