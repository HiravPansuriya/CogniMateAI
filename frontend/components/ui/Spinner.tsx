"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "border-2 border-border-default border-t-accent-primary rounded-full animate-spin",
          sizes[size]
        )}
      />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-border-default border-t-accent-primary rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}
