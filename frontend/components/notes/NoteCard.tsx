"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineDocument,
} from "react-icons/hi2";
import type { Note } from "@/types";
import { truncate, stringToColor, formatDate } from "@/lib/utils";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const subjectColor = stringToColor(note.subject);
  const isPdf = note.fileType === "pdf";

  const handleDelete = () => {
    onDelete(note._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className="bg-bg-secondary border border-border-default rounded-2xl flex flex-col h-full transition-all duration-300 hover:border-accent-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] overflow-hidden"
      >
        <Link href={`/notes/${note._id}`} className="p-5 flex flex-col flex-1 group">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center group-hover:bg-bg-tertiary/80 transition-colors">
                {isPdf ? (
                  <HiOutlineDocument className="w-5 h-5 text-accent-danger" />
                ) : (
                  <HiOutlineDocumentText className="w-5 h-5 text-accent-primary" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                  {note.title}
                </h3>
                <span className="text-xs text-text-tertiary">
                  {isPdf ? "PDF Document" : "Text Note"}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Badge */}
          <div className="mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subjectColor}`}
            >
              {note.subject}
            </span>
          </div>

          {/* Content Preview */}
          {note.content && (
            <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
              {truncate(note.content, 100)}
            </p>
          )}
          {!note.content && <div className="flex-1" />}
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 pt-3 border-t border-border-default">
          <span className="text-xs text-text-tertiary">
            {formatDate(note.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer p-1.5 rounded-lg text-text-tertiary hover:text-accent-danger hover:bg-accent-danger/10 transition-colors"
              title="Delete note"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
            </div>
            </div>
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
    </>
  );
}
