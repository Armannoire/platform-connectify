"use client";

import { useState } from "react";
import axios from "axios";
import type { ReactionSummary } from "@/types/announcement.ts";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

type Props = {
  announcementId: number;
  workspaceId: number;
  reactions: ReactionSummary[];
  currentUserId: number;
  onReactionChange: () => void;
};

export default function AnnouncementReactions({
  announcementId,
  workspaceId,
  reactions,
  currentUserId,
  onReactionChange,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReact = async (emoji: string) => {
    if (loading) return;
    setLoading(true);
    setShowPicker(false);
    try {
      await axios.post(
        `/api/workspaces/${workspaceId}/announcements/${announcementId}/reactions`,
        { emoji }
      );
      onReactionChange();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Existing reactions */}
      {reactions.map((r) => {
        const hasReacted = r.userIds.includes(currentUserId);
        return (
          <button
            key={r.emoji}
            onClick={() => handleReact(r.emoji)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              hasReacted
                ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        );
      })}

      {/* Add reaction */}
      <div className="relative">
        <button
          onClick={() => setShowPicker((p) => !p)}
          className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200"
        >
          <span>😊</span>
          <span>+</span>
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
            <div className="absolute left-0 top-8 z-20 flex gap-1 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-lg transition-all hover:bg-gray-100 hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}