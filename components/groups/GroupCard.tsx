"use client";

import { useState } from "react";
import type { GroupWithMembers } from "@/types/group";

type Props = {
  group: GroupWithMembers;
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (group: GroupWithMembers) => void;
};

export default function GroupCard({ group, currentUserId, onDelete, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = group.createdBy === currentUserId;

  return (
    <div className="relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-200 hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{group.name}</h3>
            <p className="text-xs text-gray-400">{group.memberCount} members</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.2" />
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="8" cy="13" r="1.2" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-9 z-20 w-36 rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/[0.06]">
                  <button
                    onClick={() => { onEdit(group); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(group.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {group.description && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{group.description}</p>
      )}

      {/* Members avatars */}
      {group.members.length > 0 && (
        <div className="mt-4 flex items-center gap-1">
          {group.members.slice(0, 5).map((member) => (
            <div
              key={member.userId}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white"
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {group.members.length > 5 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-2 ring-white">
              +{group.members.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}