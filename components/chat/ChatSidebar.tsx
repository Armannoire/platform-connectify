"use client";

import { useState } from "react";
import { Plus, Hash, Trash2, Search, X } from "lucide-react";
import type { Channel, DMUser } from "@/types/chat";
import CreateChannelModal from "./CreateChannelModal";

type Props = {
  channels: Channel[];
  dmUsers: DMUser[];
  activeChannelId: number | null;
  activeDMUserId: number | null;
  currentUserId: number;
  onSelectChannel: (id: number) => void;
  onSelectDMUser: (id: number) => void;
  onCreateChannel: (name: string) => Promise<{ success: boolean }>;
  onDeleteChannel: (id: number) => void;
};

export default function ChatSidebar({
  channels, dmUsers, activeChannelId, activeDMUserId,
  currentUserId, onSelectChannel, onSelectDMUser,
  onCreateChannel, onDeleteChannel,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = dmUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">

      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-4">
        <h2 className="text-base font-semibold text-gray-900">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Channels */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[11px] font-semibold tracking-widest text-gray-400">CHANNELS</span>
            <button
              onClick={() => setShowCreate(true)}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="mt-1 space-y-0.5">
            {channels.length === 0 ? (
              <p className="px-2 py-1 text-xs text-gray-400">No channels yet</p>
            ) : channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={`group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                  activeChannelId === channel.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash size={15} className="text-gray-400" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                {channel.createdBy === currentUserId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteChannel(channel.id); }}
                    className="hidden h-5 w-5 items-center justify-center rounded text-gray-400 hover:text-red-500 group-hover:flex"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DMs */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[11px] font-semibold tracking-widest text-gray-400">DIRECT MESSAGES</span>
            <button
              onClick={() => setShowSearch((p) => !p)}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              {showSearch ? <X size={13} /> : <Plus size={13} />}
            </button>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="mt-1 mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
              <Search size={12} className="text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          )}

          <div className="mt-1 space-y-0.5">
            {(showSearch ? filteredUsers : dmUsers).length === 0 ? (
              <p className="px-2 py-1 text-xs text-gray-400">
                {showSearch ? "No members found" : "No members yet"}
              </p>
            ) : (showSearch ? filteredUsers : dmUsers).map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onSelectDMUser(user.id);
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                  activeDMUserId === user.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 overflow-hidden">
                  {user.avatar
                    ? <img src={user.avatar} className="h-6 w-6 rounded-full object-cover" alt={user.name} />
                    : user.name.charAt(0).toUpperCase()
                  }
                </div>
                <span className="text-sm truncate">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateChannelModal
          onSubmit={onCreateChannel}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}