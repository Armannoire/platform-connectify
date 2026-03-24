"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import type { ChannelMessage, DirectMessage } from "@/types/chat";

type Props = {
  title: string;
  subtitle?: string;
  messages: (ChannelMessage | DirectMessage)[];
  loading: boolean;
  currentUserId: number;
  onSend: (content: string) => Promise<{ success: boolean }>;
  onDelete: (id: number) => void;
  isChannel?: boolean;
};

export default function ChatWindow({ title, subtitle, messages, loading, currentUserId, onSend, onDelete, isChannel }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAuthorId = (msg: ChannelMessage | DirectMessage) =>
    "authorId" in msg ? msg.authorId : msg.senderId;

  const getAuthorName = (msg: ChannelMessage | DirectMessage) =>
    "authorName" in msg ? msg.authorName : msg.senderName;

  const getAuthorAvatar = (msg: ChannelMessage | DirectMessage) =>
    "authorAvatar" in msg ? msg.authorAvatar : msg.senderAvatar;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white">
          {isChannel ? "#" : title.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{isChannel ? `# ${title}` : title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                <div className={`h-10 animate-pulse rounded-2xl bg-gray-200 ${i % 2 === 0 ? "w-48" : "w-64"}`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 text-4xl">{isChannel ? "💬" : "👋"}</div>
            <p className="text-sm font-medium text-gray-900">No messages yet</p>
            <p className="mt-1 text-xs text-gray-400">Be the first to say something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                authorName={getAuthorName(msg)}
                authorAvatar={getAuthorAvatar(msg)}
                createdAt={msg.createdAt}
                isOwn={getAuthorId(msg) === currentUserId}
                onDelete={() => onDelete(msg.id)}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4">
        <MessageInput
          onSend={onSend}
          placeholder={isChannel ? `Message # ${title}` : `Message ${title}`}
        />
      </div>
    </div>
  );
}