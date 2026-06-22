"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import api from "@/lib/api";
import type { Note } from "@/types";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";
import { HiOutlineSparkles, HiOutlineClipboardDocument } from "react-icons/hi2";

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState(searchParams.get("noteId") || "");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingNotes, setFetchingNotes] = useState(true);

  useEffect(() => {
    api.get("/notes").then((res) => {
      setNotes(res.data.data || res.data || []);
    }).catch((err) => {
      toast.error(err.response?.data?.message || "Failed to fetch notes");
    }).finally(() => setFetchingNotes(false));
  }, []);

  const generateSummary = async () => {
    if (!selectedNote) return toast.error("Please select a note");
    setLoading(true);
    setSummary(null);
    try {
      const res = await api.post("/summary/generate", { noteId: selectedNote });
      const data = res.data.data || res.data;
      setSummary(data.content || data.summary || JSON.stringify(data, null, 2));
      toast.success("Summary generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <HiOutlineSparkles className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Summary Generator</h1>
          <p className="text-text-secondary text-sm">Generate concise summaries from your notes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">Select a Note</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedNote}
            onChange={setSelectedNote}
            options={notes.map((n) => ({ value: n._id, label: `${n.title} — ${n.subject}` }))}
            placeholder={fetchingNotes ? "Loading notes..." : "Choose a note..."}
            disabled={fetchingNotes}
            className="flex-1"
          />
          <Button variant="primary" onClick={generateSummary} isLoading={loading} icon={<HiOutlineSparkles className="w-4 h-4" />}>
            Generate
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card p-6 space-y-4">
          <div className="h-4 w-1/3 shimmer rounded" />
          <div className="h-3 w-full shimmer rounded" />
          <div className="h-3 w-5/6 shimmer rounded" />
          <div className="h-3 w-4/6 shimmer rounded" />
          <div className="h-4 w-1/4 shimmer rounded mt-4" />
          <div className="h-3 w-full shimmer rounded" />
          <div className="h-3 w-3/4 shimmer rounded" />
        </div>
      )}

      {/* Summary */}
      {summary && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Generated Summary</h2>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} icon={<HiOutlineClipboardDocument className="w-4 h-4" />}>
              Copy
            </Button>
          </div>
          <div className="prose prose-invert max-w-none text-text-secondary
            prose-headings:text-text-primary prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4
            prose-p:leading-relaxed prose-p:my-3
            prose-li:my-2
            prose-strong:text-accent-primary prose-strong:font-bold">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {summary}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!summary && !loading && (
        <div className="text-center py-16 text-text-tertiary">
          <HiOutlineSparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a note and click Generate to create an AI summary</p>
        </div>
      )}
    </motion.div>
  );
}
