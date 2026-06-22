"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { Note } from "@/types";
import NoteViewer from "@/components/notes/NoteViewer";
import { GlassCard } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAcademicCap,
  HiOutlineRectangleStack,
  HiOutlineTrash,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import Modal from "@/components/ui/Modal";

const actions = [
  { href: "/summary", icon: HiOutlineSparkles, title: "Generate Summary", desc: "Get AI-powered summary of this note", color: "text-indigo-400" },
  { href: "/chat", icon: HiOutlineChatBubbleLeftRight, title: "Chat with Note", desc: "Ask questions about this content", color: "text-emerald-400" },
  { href: "/quiz", icon: HiOutlineAcademicCap, title: "Generate Quiz", desc: "Test your knowledge with a quiz", color: "text-violet-400" },
  { href: "/flashcards", icon: HiOutlineRectangleStack, title: "Generate Flashcards", desc: "Create flashcards for revision", color: "text-amber-400" },
];

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${params.id}`);
        setNote(res.data.data);
      } catch {
        setNote(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchNote();
  }, [params.id]);

  const handleDelete = async () => {
    if (!note) return;
    try {
      await api.delete(`/notes/${note._id}`);
      toast.success("Note deleted");
      router.push("/notes");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <PageSpinner />;

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Note not found</h2>
        <p className="text-text-secondary mb-4">The note you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/notes"><Button variant="secondary">Back to Notes</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-3 transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Notes
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">{note.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge>{note.subject}</Badge>
            <span className="text-sm text-text-tertiary">{formatDate(note.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <NoteViewer note={note} />

      {/* AI Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">AI Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={`${action.href}?noteId=${note._id}`}>
              <GlassCard className="p-5 group cursor-pointer hover:border-accent-primary/30 h-full">
                <action.icon className={`w-6 h-6 ${action.color} mb-3`} />
                <h3 className="text-sm font-semibold text-text-primary mb-1">{action.title}</h3>
                <p className="text-xs text-text-secondary mb-3">{action.desc}</p>
                <HiOutlineArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary transition-colors" />
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Delete */}
      <div className="pt-4 border-t border-border-default">
        <Button variant="danger" onClick={() => setShowDeleteModal(true)} icon={<HiOutlineTrash className="w-4 h-4" />}>
          Delete Note
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Note"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to delete <span className="text-text-primary font-medium">"{note.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="danger" onClick={handleDelete} className="w-full">
              Delete Note
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
