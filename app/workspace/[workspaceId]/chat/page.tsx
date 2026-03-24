"use client";

import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const { workspaceId } = useParams();

  // TODO: replace with real session
  const currentUserId = 1;

  const {
    channels, activeChannelId, channelMessages,
    dmUsers, activeDMUserId, directMessages,
    loading, messagesLoading,
    createChannel, deleteChannel, selectChannel,
    sendChannelMessage, deleteChannelMessage,
    selectDMUser, sendDirectMessage, deleteDirectMessage,
  } = useChat(Number(workspaceId), currentUserId);

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const activeDMUser  = dmUsers.find((u) => u.id === activeDMUserId);

  return (
    <div className="-m-8 flex h-[calc(100vh-64px)]">

      {/* Chat Sidebar */}
      <ChatSidebar
        channels={channels}
        dmUsers={dmUsers}
        activeChannelId={activeChannelId}
        activeDMUserId={activeDMUserId}
        currentUserId={currentUserId}
        onSelectChannel={selectChannel}
        onSelectDMUser={selectDMUser}
        onCreateChannel={createChannel}
        onDeleteChannel={deleteChannel}
      />

      {/* Chat Window */}
      <div className="flex-1">
        {activeChannel ? (
          <ChatWindow
            title={activeChannel.name}
            messages={channelMessages}
            loading={messagesLoading}
            currentUserId={currentUserId}
            onSend={sendChannelMessage}
            onDelete={deleteChannelMessage}
            isChannel
          />
        ) : activeDMUser ? (
          <ChatWindow
            title={activeDMUser.name}
            messages={directMessages}
            loading={messagesLoading}
            currentUserId={currentUserId}
            onSend={sendDirectMessage}
            onDelete={deleteDirectMessage}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 text-5xl">💬</div>
            <p className="text-sm font-medium text-gray-900">Select a channel or person</p>
            <p className="mt-1 text-xs text-gray-400">Choose from the sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}