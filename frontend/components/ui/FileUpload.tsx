"use client";

import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { HiOutlineCloudArrowUp, HiOutlineDocument } from "react-icons/hi2";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = ".pdf",
  maxSizeMB = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
          isDragging
            ? "border-accent-primary bg-accent-primary/5"
            : "border-border-default hover:border-border-hover bg-bg-tertiary/50",
          selectedFile && "border-accent-success bg-accent-success/5"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <HiOutlineDocument className="w-8 h-8 text-accent-success" />
            <p className="text-sm font-medium text-text-primary">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-secondary">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <HiOutlineCloudArrowUp
              className={cn(
                "w-8 h-8",
                isDragging ? "text-accent-primary" : "text-text-tertiary"
              )}
            />
            <p className="text-sm text-text-secondary">
              <span className="text-accent-primary font-medium">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-text-tertiary">
              PDF files up to {maxSizeMB}MB
            </p>
          </div>
        )}
      </label>
      {error && <p className="mt-2 text-sm text-accent-danger">{error}</p>}
    </div>
  );
}
