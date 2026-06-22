"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  glow = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-secondary border border-border-default rounded-2xl p-6 transition-all duration-300",
        hover && "hover:border-accent-primary/30 hover:shadow-card-hover cursor-pointer",
        glow && "animate-pulse-glow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Glass variant
export function GlassCard({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("glass-card p-6", className)}
      onClick={props.onClick}
    >
      {children}
    </div>
  );
}
