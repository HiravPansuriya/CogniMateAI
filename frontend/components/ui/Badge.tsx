"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-accent-primary/15 text-accent-primary-hover",
    success: "bg-accent-success/15 text-accent-success",
    warning: "bg-accent-warning/15 text-accent-warning",
    danger: "bg-accent-danger/15 text-accent-danger",
    info: "bg-accent-info/15 text-accent-info",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
