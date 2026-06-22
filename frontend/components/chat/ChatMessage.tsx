"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { ChatMessage as ChatMessageType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { formatRelativeTime, getInitials, cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          isUser
            ? "gradient-bg text-white"
            : "bg-bg-tertiary border border-border-default text-accent-primary"
        )}
      >
        {isUser ? (
          user?.name ? getInitials(user.name) : "U"
        ) : (
          <HiOutlineSparkles className="w-4 h-4" />
        )}
      </div>

      {/* Bubble */}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "px-4 py-3 text-sm",
            isUser
              ? "chat-bubble-user text-white leading-relaxed"
              : "chat-bubble-ai text-text-primary"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none 
              prose-headings:text-text-primary prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
              prose-p:leading-relaxed prose-p:my-2
              prose-li:my-1
              prose-strong:text-accent-primary prose-strong:font-bold
              prose-pre:bg-bg-tertiary prose-pre:border prose-pre:border-border-default 
              prose-code:text-accent-secondary prose-code:bg-bg-tertiary prose-code:px-1 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-[10px] text-text-tertiary px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}
