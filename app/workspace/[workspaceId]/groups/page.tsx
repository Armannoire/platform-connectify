"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import GroupsList from "@/components/groups/GroupsList";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import GroupEditor from "@/components/groups/GroupEditor";
import type { GroupWithMembers } from "@/types/group";

export default function GroupsPage() {
  const { workspaceId } = useParams();
  const {
    groups,
    loading,
    error,
    createGroup,
    editGroup,
    deleteGroup,
  } = useGroups(Number(workspaceId));

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<GroupWithMembers | null>(null);

  const currentUserId = 1;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your workspace members into groups
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          + New Group
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
            <div key={i} className="h-36 animate-pulse rounded-xl bg-white ring-1 ring-black/[0.04]" />
          ))}
        </div>
      ) : (
        <GroupsList
          groups={groups}
          currentUserId={currentUserId}
          onDelete={deleteGroup}
          onEdit={setEditing}
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
    </>
  );
}