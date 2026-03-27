"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import type { AnnouncementComment } from "@/types/announcement.ts";

type Props = {
  announcementId: number;
  workspaceId: number;
  currentUserId: number;
};

function CommentItem({
  comment,
  currentUserId,
  workspaceId,
  announcementId,
  onRefresh,
  depth = 0,
}: {
  comment: AnnouncementComment;
  currentUserId: number;
  workspaceId: number;
  announcementId: number;
  onRefresh: () => void;
  depth?: number;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const isOwn = comment.authorId === currentUserId;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        `/api/workspaces/${workspaceId}/announcements/${announcementId}/comments`,
        { content: replyText, parentId: comment.id }
      );
      setReplyText("");
      setReplying(false);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/workspaces/${workspaceId}/announcements/${announcementId}/comments/${comment.id}`
      );
      onRefresh();
    } catch {}
  };

  const date = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {comment.authorAvatar ? (
          <img src={comment.authorAvatar} alt={comment.authorName} className="h-7 w-7 shrink-0 rounded-full object-cover" />
        ) : (
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-900">{comment.authorName}</span>
              <span className="text-[10px] text-gray-400">{date}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
          </div>

          {/* Actions */}
          <div className="mt-1.5 flex items-center gap-3 px-1">
            {depth === 0 && (
              <button
                onClick={() => setReplying((p) => !p)}
                className="text-[11px] font-medium text-gray-400 hover:text-violet-500 transition-colors"
              >
                Reply
              </button>
            )}
            {isOwn && (
              <button
                onClick={handleDelete}
                className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply input */}
          {replying && (
            <div className="mt-3 flex items-center gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder="Write a reply..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
              />
              <button
                onClick={handleReply}
                disabled={loading || !replyText.trim()}
                className="rounded-xl px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                {loading ? "..." : "Reply"}
              </button>
              <button
                onClick={() => { setReplying(false); setReplyText(""); }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  workspaceId={workspaceId}
                  announcementId={announcementId}
                  onRefresh={onRefresh}
                  depth={1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementComments({ announcementId, workspaceId, currentUserId }: Props) {
  const [comments, setComments] = useState<AnnouncementComment[]>([]);
  const [loading, setLoading]   = useState(false);
  const [text, setText]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen]         = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/workspaces/${workspaceId}/announcements/${announcementId}/comments`
      );
      setComments(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [open]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `/api/workspaces/${workspaceId}/announcements/${announcementId}/comments`,
        { content: text }
      );
      setText("");
      fetchComments();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-violet-500 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {comments.length > 0 ? `${comments.length} comments` : "Comment"}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {/* Comment input */}
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !text.trim()}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {submitting ? "..." : "Post"}
            </button>
          </div>

          {/* Comments list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-4">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentUserId={currentUserId}
                  workspaceId={workspaceId}
                  announcementId={announcementId}
                  onRefresh={fetchComments}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}