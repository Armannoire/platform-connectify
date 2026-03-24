"use client";

import AnnouncementCard from "./AnnouncementCard";
import type { AnnouncementWithAuthor } from "@/types/announcement.ts";

type Props = {
  announcements: AnnouncementWithAuthor[];
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (announcement: AnnouncementWithAuthor) => void;
};

export default function AnnouncementsList({ announcements, currentUserId, onDelete, onEdit }: Props) {
  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <div className="mb-3 h-10 w-10 rounded-xl bg-gray-100" />
        <p className="text-sm font-medium text-gray-900">No announcements yet</p>
        <p className="mt-1 text-xs text-gray-400">Create the first announcement for your workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <AnnouncementCard
          key={a.id}
          announcement={a}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}