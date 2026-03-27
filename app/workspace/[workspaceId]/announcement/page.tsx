"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import AnnouncementsList from "@/components/announcements/AnnouncementsList";
import CreateAnnouncementModal from "@/components/announcements/CreateAnnouncementModal";
import AnnouncementEditor from "@/components/announcements/AnnouncementEditor";
import type { AnnouncementWithAuthor } from "@/types/announcement.ts";
import { Bell } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function AnnouncementsPage() {
  const { workspaceId } = useParams();
  const { user } = useUserStore();
  const {
    announcements, loading, error,
    createAnnouncement, editAnnouncement, deleteAnnouncement,
  } = useAnnouncements(Number(workspaceId));

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing]       = useState<AnnouncementWithAuthor | null>(null);

  const currentUserId = user?.id ?? 1;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
          <p className="mt-1 text-sm text-gray-400">
            {announcements.length > 0 ? `${announcements.length} announcements` : "Stay up to date with your workspace"}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <Bell size={15} />
          New Announcement
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.04]" />
          ))}
        </div>
      ) : (
        <AnnouncementsList
          announcements={announcements}
          currentUserId={currentUserId}
          workspaceId={Number(workspaceId)}
          onDelete={deleteAnnouncement}
          onEdit={setEditing}
        />
      )}

      {showCreate && (
        <CreateAnnouncementModal
          onSubmit={createAnnouncement}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editing && (
        <AnnouncementEditor
          announcement={editing}
          onSubmit={(data) => editAnnouncement(editing.id, data)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}