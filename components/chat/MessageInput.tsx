"use client";

import { useState, useRef, KeyboardEvent } from "react";

type Props = {
  onSend: (content: string) => Promise<{ success: boolean }>;
  placeholder?: string;
};

export default function MessageInput({ onSend, placeholder = "Write a message..." }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!value.trim() || loading) return;
    setLoading(true);
    const result = await onSend(value.trim());
    setLoading(false);
    if (result.success) {
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        }}
        disabled={loading}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-50"
        style={{ maxHeight: "120px" }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || loading}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition-opacity hover:opacity-90 disabled:opacity-30"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="13" y1="1" x2="1" y2="13" />
          <polyline points="1,1 13,1 13,13" />
        </svg>
      </button>
    </div>
  );
}