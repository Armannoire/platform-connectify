"use client";

import GroupCard from "./GroupCard";
import type { GroupWithMembers } from "@/types/group";

type Props = {
  groups: GroupWithMembers[];
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (group: GroupWithMembers) => void;
  onSelect: (group: GroupWithMembers) => void;
};

export default function GroupsList({ groups, currentUserId, onDelete, onEdit, onSelect }: Props) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-100 bg-violet-50/30 py-20 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "linear-gradient(135deg, #667eea22, #764ba222)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 1-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">No groups yet</p>
        <p className="mt-1 text-xs text-gray-400">Create the first group for your workspace</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <GroupCard
          key={g.id}
          group={g}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}