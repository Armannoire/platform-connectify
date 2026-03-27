"use client";

import { useState } from "react";
import type { GroupWithMembers } from "@/types/group";

type Props = {
  group: GroupWithMembers;
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (group: GroupWithMembers) => void;
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

export default function GroupCard({ group, currentUserId, onDelete, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = group.createdBy === currentUserId;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(109,40,217,0.1)] hover:-translate-y-0.5">

      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
            style={{ background: getGradient(group.name) }}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{group.name}</h3>
            <p className="text-xs text-gray-400">
              {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-violet-50 hover:text-violet-500"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
                <circle cx="7.5" cy="2.5" r="1.3" />
                <circle cx="7.5" cy="7.5" r="1.3" />
                <circle cx="7.5" cy="12.5" r="1.3" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.05]">
                  <button
                    onClick={() => { onEdit(group); setShowMenu(false); }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(group.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
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
        <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {group.description}
        </p>
      )}

      {/* Members row */}
      {group.members.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {group.members.slice(0, 5).map((member, i) => (
              <div
                key={member.userId}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white"
                style={{
                  background: getGradient(member.name),
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: 5 - i,
                  position: "relative",
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {group.members.length > 5 && (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-[10px] font-semibold text-violet-500 ring-2 ring-white"
                style={{ marginLeft: -8, position: "relative", zIndex: 0 }}
              >
                +{group.members.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}