"use client";

import GroupCard from "./GroupCard";
import type { GroupWithMembers } from "@/types/group";

type Props = {
  groups: GroupWithMembers[];
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (group: GroupWithMembers) => void;
};

export default function GroupsList({ groups, currentUserId, onDelete, onEdit }: Props) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <div className="mb-3 h-10 w-10 rounded-xl bg-gray-100" />
        <p className="text-sm font-medium text-gray-900">No groups yet</p>
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
        />
      ))}
    </div>
  );
}