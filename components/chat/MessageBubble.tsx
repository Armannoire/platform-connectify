"use client";

type Props = {
  content: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: Date;
  isOwn: boolean;
  onDelete?: () => void;
};

export default function MessageBubble({ content, authorName, authorAvatar, createdAt, isOwn, onDelete }: Props) {
  const time = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`group flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {!isOwn && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          {authorAvatar
            ? <img src={authorAvatar} className="h-8 w-8 rounded-full object-cover" />
            : authorName.charAt(0).toUpperCase()
          }
        </div>
      )}

      <div className={`flex max-w-[70%] flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="px-1 text-xs font-medium text-gray-500">{authorName}</span>
        )}

        <div className="relative">
          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "rounded-br-sm bg-gray-900 text-white"
              : "rounded-bl-sm bg-white text-gray-900 shadow-sm ring-1 ring-black/[0.04]"
          }`}>
            {content}
          </div>

          {isOwn && onDelete && (
            <button
              onClick={onDelete}
              className="absolute -left-7 top-1/2 -translate-y-1/2 hidden h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 group-hover:flex"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>
          )}
        </div>

        <span className="px-1 text-[10px] text-gray-400">{time}</span>
      </div>
    </div>
  );
}