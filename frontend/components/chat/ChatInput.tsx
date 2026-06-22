"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border-default bg-bg-secondary/80 backdrop-blur-xl">
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl border bg-bg-tertiary/50 px-4 py-3 transition-all duration-300",
          isFocused
            ? "border-accent-primary shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
            : "border-border-default"
        )}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything about your notes..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none min-h-[24px] max-h-[120px] disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
            message.trim() && !isLoading
              ? "gradient-bg text-white hover:shadow-lg hover:shadow-accent-primary/25 cursor-pointer"
              : "bg-bg-hover text-text-tertiary cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiOutlinePaperAirplane className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-text-tertiary mt-2 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
