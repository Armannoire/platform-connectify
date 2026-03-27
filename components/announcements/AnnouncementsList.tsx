"use client";

import { Bell } from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";
import type { AnnouncementWithAuthor } from "@/types/announcement.ts";

type Props = {
  announcements: AnnouncementWithAuthor[];
  currentUserId: number;
  workspaceId: number;
  onDelete: (id: number) => void;
  onEdit: (announcement: AnnouncementWithAuthor) => void;
};

export default function AnnouncementsList({ announcements, currentUserId, workspaceId, onDelete, onEdit }: Props) {
  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">
          <Bell size={20} className="text-violet-400" />
        </div>
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
          workspaceId={workspaceId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}