"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAcademicCap,
  HiOutlineRectangleStack,
  HiOutlineCalendarDays,
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", icon: HiOutlineHome, label: "Dashboard" },
  { href: "/notes", icon: HiOutlineDocumentText, label: "Notes" },
  { href: "/summary", icon: HiOutlineSparkles, label: "AI Summary" },
  { href: "/chat", icon: HiOutlineChatBubbleLeftRight, label: "Chat" },
  { href: "/quiz", icon: HiOutlineAcademicCap, label: "Quiz" },
  { href: "/flashcards", icon: HiOutlineRectangleStack, label: "Flashcards" },
  // { href: "/planner", icon: HiOutlineCalendarDays, label: "Planner" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-16 lg:w-64 bg-bg-secondary border-r border-border-default flex flex-col transition-all duration-300">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border-default flex-shrink-0">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
          <HiOutlineAcademicCap className="w-5 h-5 text-white" />
        </div>
        <span className="hidden lg:block text-lg font-bold gradient-text">
          CogniMate
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              )}
            >
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent-primary rounded-l-full" />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
              {/* Tooltip for collapsed */}
              <span className="lg:hidden absolute left-full ml-2 px-2 py-1 rounded-md bg-bg-tertiary text-text-primary text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 space-y-1 border-t border-border-default">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/profile"
              ? "bg-accent-primary/10 text-accent-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
          )}
        >
          <HiOutlineUserCircle className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-all duration-200 w-full"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}
