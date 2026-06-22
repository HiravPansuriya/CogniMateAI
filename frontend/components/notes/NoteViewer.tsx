"use client";

import React from "react";
import { HiOutlineDocumentArrowDown, HiOutlineDocument } from "react-icons/hi2";
import type { Note } from "@/types";

interface NoteViewerProps {
  note: Note;
}

export default function NoteViewer({ note }: NoteViewerProps) {
  const isPdf = note.fileType === "pdf";

  if (isPdf && note.fileUrl) {
    return (
      <div className="space-y-4">
        {/* PDF Embed */}
        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border-default bg-bg-tertiary">
          <iframe
            src={note.fileUrl}
            className="w-full h-full"
            title={note.title}
          />
        </div>

        {/* Download Link */}
        <a
          href={note.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-tertiary border border-border-default text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 text-sm font-medium"
        >
          <HiOutlineDocumentArrowDown className="w-5 h-5" />
          Download PDF
          {note.pageCount && (
            <span className="text-text-tertiary">
              · {note.pageCount} {note.pageCount === 1 ? "page" : "pages"}
            </span>
          )}
        </a>

        {/* Extracted text content if available */}
        {note.content && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
              <HiOutlineDocument className="w-4 h-4" />
              Extracted Text
            </h4>
            <div className="max-h-[500px] overflow-y-auto rounded-xl bg-bg-tertiary border border-border-default p-6">
              <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap font-[inherit]">
                {note.content}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Text note
  return (
    <div className="max-h-[700px] overflow-y-auto rounded-xl bg-bg-tertiary border border-border-default p-6">
      <div className="text-text-primary text-sm leading-7 whitespace-pre-wrap font-[inherit]">
        {note.content || (
          <span className="text-text-tertiary italic">
            No content available for this note.
          </span>
        )}
      </div>
    </div>
  );
}
