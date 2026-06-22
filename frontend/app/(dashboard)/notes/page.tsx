"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { Note } from "@/types";
import NoteCard from "@/components/notes/NoteCard";
import UploadModal from "@/components/notes/UploadModal";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";
import { HiOutlineDocumentText, HiOutlineMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data.data || res.data || []);
    } catch (err: any) {
      setNotes([]);
      toast.error(err.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const subjects = [...new Set(notes.map((n) => n.subject).filter(Boolean))];
  const filtered = notes.filter((n) => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || n.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Notes</h1>
          <p className="text-text-secondary text-sm mt-1">{notes.length} notes uploaded</p>
        </div>
        <Button variant="primary" icon={<HiOutlinePlus className="w-4 h-4" />} onClick={() => setUploadOpen(true)}>
          Upload Notes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search notes..." icon={<HiOutlineMagnifyingGlass className="w-5 h-5" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select
          value={subjectFilter}
          onChange={setSubjectFilter}
          options={[{ value: "", label: "All Subjects" }, ...subjects.map((s) => ({ value: s, label: s }))]}
          placeholder="All Subjects"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-bg-secondary border border-border-default rounded-2xl p-6 space-y-3">
              <div className="h-4 w-2/3 shimmer rounded" />
              <div className="h-3 w-1/3 shimmer rounded" />
              <div className="h-16 shimmer rounded" />
              <div className="h-3 w-1/2 shimmer rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        notes.length === 0 ? (
          <EmptyState
            icon={<HiOutlineDocumentText className="w-8 h-8" />}
            title="No notes yet"
            description="Upload your first study note to get started with AI-powered learning."
            action={<Button variant="primary" onClick={() => setUploadOpen(true)}>Upload Notes</Button>}
          />
        ) : (
          <EmptyState
            icon={<HiOutlineMagnifyingGlass className="w-8 h-8" />}
            title="No results found"
            description="Try adjusting your search or filter criteria."
          />
        )
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <motion.div key={note._id} variants={item}>
              <NoteCard note={note} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploadSuccess={() => { setUploadOpen(false); fetchNotes(); }} />
    </div>
  );
}
