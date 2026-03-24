"use client";

import { useState } from "react";
import type { AnnouncementWithAuthor } from "@/types/announcement.ts";

type Props = {
  announcement: AnnouncementWithAuthor;
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (announcement: AnnouncementWithAuthor) => void;
};

export default function AnnouncementCard({
  announcement,
  currentUserId,
  onDelete,
  onEdit,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = announcement.authorId === currentUserId;

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-200 hover:shadow-md">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            {announcement.authorName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {announcement.authorName}
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>

        {isAuthor && (
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
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-9 z-20 w-36 rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/[0.06]">
                  <button
                    onClick={() => { onEdit(announcement); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(announcement.id); setShowMenu(false); }}
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

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900">
          {announcement.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          {announcement.content}
        </p>
      </div>
    </div>
  );
}