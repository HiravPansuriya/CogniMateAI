"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { Note, ChatMessage as ChatMessageType } from "@/types";
import ChatMessageComponent from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState(searchParams.get("noteId") || "");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingNotes, setFetchingNotes] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/notes").then((res) => {
      setNotes(res.data.data || res.data || []);
    }).catch((err) => {
      toast.error(err.response?.data?.message || "Failed to fetch notes");
    }).finally(() => setFetchingNotes(false));
  }, []);

  useEffect(() => {
    if (selectedNote) {
      api.get(`/chat/history/${selectedNote}`).then((res) => {
        setMessages(res.data.data || res.data || []);
      }).catch((err) => {
        setMessages([]);
        toast.error(err.response?.data?.message || "Failed to fetch chat history");
      });
    } else {
      setMessages([]);
    }
  }, [selectedNote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question: string) => {
    if (!selectedNote) return toast.error("Please select a note first");
    const userMsg: ChatMessageType = { _id: Date.now().toString(), role: "user", content: question, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.post("/chat/ask", { noteId: selectedNote, question });
      const data = res.data.data || res.data;
      const aiMsg: ChatMessageType = {
        _id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || data.answer || "I couldn't find an answer.",
        sources: data.sources,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Chat with Notes</h1>
            <p className="text-text-secondary text-xs">Ask questions about your study materials</p>
          </div>
        </div>
        <Select
          value={selectedNote}
          onChange={setSelectedNote}
          options={notes.map((n) => ({ value: n._id, label: n.title }))}
          placeholder={fetchingNotes ? "Loading..." : "Select a note..."}
          disabled={fetchingNotes}
          className="sm:ml-auto min-w-48"
        />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 px-1">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <HiOutlineChatBubbleLeftRight className="w-16 h-16 text-text-tertiary/30 mb-4" />
            <p className="text-text-secondary text-sm">
              {selectedNote ? "Ask a question about this note" : "Select a note to start chatting"}
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessageComponent key={msg._id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
              <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-accent-primary" />
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t border-border-default">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
