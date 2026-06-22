"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getGreeting, getInitials } from "@/lib/utils";
import { HiBars3 } from "react-icons/hi2";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/notes": "My Notes",
  "/summary": "AI Summary",
  "/chat": "Chat with Notes",
  "/quiz": "Quiz",
  "/flashcards": "Flashcards",
  "/planner": "Study Planner",
  "/profile": "Profile",
};

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle =
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ||
    "Dashboard";

  return (
    <header className="fixed top-0 right-0 left-16 lg:left-64 z-30 h-16 bg-bg-primary/80 backdrop-blur-xl border-b border-border-default flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          <HiBars3 className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm text-text-secondary">
          {getGreeting()},{" "}
          <span className="text-text-primary font-medium">
            {user?.name?.split(" ")[0] || "Student"}
          </span>
        </span>
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
          {user?.name ? getInitials(user.name) : "U"}
        </div>
      </div>
    </header>
  );
}
