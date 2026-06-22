"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

type TabType = "pdf" | "text";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pdf");
  const [isLoading, setIsLoading] = useState(false);

  // PDF form state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfSubject, setPdfSubject] = useState("");

  // Text form state
  const [textTitle, setTextTitle] = useState("");
  const [textSubject, setTextSubject] = useState("");
  const [textContent, setTextContent] = useState("");

  const resetForm = () => {
    setPdfFile(null);
    setPdfTitle("");
    setPdfSubject("");
    setTextTitle("");
    setTextSubject("");
    setTextContent("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePdfSubmit = async () => {
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }
    if (!pdfTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!pdfSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("title", pdfTitle.trim());
      formData.append("subject", pdfSubject.trim());

      await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("PDF uploaded successfully!");
      resetForm();
      onUploadSuccess();
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to upload PDF";
      const axiosMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || message;
      toast.error(axiosMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!textSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!textContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/notes/text", {
        title: textTitle.trim(),
        subject: textSubject.trim(),
        content: textContent.trim(),
      });

      toast.success("Note created successfully!");
      resetForm();
      onUploadSuccess();
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create note";
      const axiosMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || message;
      toast.error(axiosMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    {
      key: "pdf",
      label: "Upload PDF",
      icon: <HiOutlineDocumentArrowUp className="w-4 h-4" />,
    },
    {
      key: "text",
      label: "Text Note",
      icon: <HiOutlineDocumentText className="w-4 h-4" />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Notes" size="lg">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-tertiary rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              activeTab === tab.key
                ? "bg-bg-secondary text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "pdf" ? (
          <motion.div
            key="pdf"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <FileUpload
              onFileSelect={(file) => setPdfFile(file)}
              accept=".pdf"
              maxSizeMB={10}
            />
            <Input
              label="Title"
              placeholder="e.g., Chapter 5 — Thermodynamics"
              value={pdfTitle}
              onChange={(e) => setPdfTitle(e.target.value)}
            />
            <Input
              label="Subject"
              placeholder="e.g., Physics"
              value={pdfSubject}
              onChange={(e) => setPdfSubject(e.target.value)}
            />
            <div className="pt-2">
              <Button
                onClick={handlePdfSubmit}
                isLoading={isLoading}
                icon={<HiOutlineDocumentArrowUp className="w-4 h-4" />}
                className="w-full"
              >
                Upload PDF
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Input
              label="Title"
              placeholder="e.g., Lecture Notes — Cell Biology"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
            />
            <Input
              label="Subject"
              placeholder="e.g., Biology"
              value={textSubject}
              onChange={(e) => setTextSubject(e.target.value)}
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Content
              </label>
              <textarea
                placeholder="Paste or type your notes here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                className="w-full bg-bg-tertiary border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary transition-all duration-200 input-glow resize-none text-sm leading-relaxed"
              />
            </div>
            <div className="pt-2">
              <Button
                onClick={handleTextSubmit}
                isLoading={isLoading}
                icon={<HiOutlineDocumentText className="w-4 h-4" />}
                className="w-full"
              >
                Create Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
