"use client";

import { useState } from "react";
import axios from "axios";
import type { AnnouncementWithAuthor, ReactionSummary } from "@/types/announcement.ts";
import AnnouncementReactions from "./AnnouncementReactions";
import AnnouncementComments from "./AnnouncementComments";

type Props = {
  announcement: AnnouncementWithAuthor;
  currentUserId: number;
  workspaceId: number;
  onDelete: (id: number) => void;
  onEdit: (announcement: AnnouncementWithAuthor) => void;
};

export default function AnnouncementCard({
  announcement,
  currentUserId,
  workspaceId,
  onDelete,
  onEdit,
}: Props) {
  const [showMenu, setShowMenu]       = useState(false);
  const [reactions, setReactions]     = useState<ReactionSummary[]>([]);
  const [reactionsLoaded, setReactionsLoaded] = useState(false);
  const isAuthor = announcement.authorId === currentUserId;

  const fetchReactions = async () => {
    try {
      const res = await axios.get(
        `/api/workspaces/${workspaceId}/announcements/${announcement.id}/reactions`
      );
      setReactions(res.data.data);
      setReactionsLoaded(true);
    } catch {}
  };

  useState(() => { fetchReactions(); });

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {announcement.authorAvatar ? (
            <img
              src={announcement.authorAvatar}
              alt={announcement.authorName}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-100"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {announcement.authorName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{announcement.authorName}</p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
                <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">
                  <button
                    onClick={() => { onEdit(announcement); setShowMenu(false); }}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(announcement.id); setShowMenu(false); }}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900">{announcement.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{announcement.content}</p>
      </div>

      {/* Reactions */}
      <div className="mt-4">
        <AnnouncementReactions
          announcementId={announcement.id}
          workspaceId={workspaceId}
          reactions={reactions}
          currentUserId={currentUserId}
          onReactionChange={fetchReactions}
        />
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-50" />

      {/* Comments */}
      <AnnouncementComments
        announcementId={announcement.id}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
      />
    </div>
  );
}