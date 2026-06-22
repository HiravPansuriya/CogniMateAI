"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
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
  HiXMark,
} from "react-icons/hi2";

const navItems = [
  { href: "/dashboard", icon: HiOutlineHome, label: "Dashboard" },
  { href: "/notes", icon: HiOutlineDocumentText, label: "Notes" },
  { href: "/summary", icon: HiOutlineSparkles, label: "AI Summary" },
  { href: "/chat", icon: HiOutlineChatBubbleLeftRight, label: "Chat" },
  { href: "/quiz", icon: HiOutlineAcademicCap, label: "Quiz" },
  { href: "/flashcards", icon: HiOutlineRectangleStack, label: "Flashcards" },
  { href: "/planner", icon: HiOutlineCalendarDays, label: "Planner" },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
    toast.success("Logged out successfully");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-72 bg-bg-secondary border-r border-border-default z-50 lg:hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-default">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <HiOutlineAcademicCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">CogniMate</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="py-4 px-3 space-y-1 border-t border-border-default">
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200"
              >
                <HiOutlineUserCircle className="w-5 h-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-all duration-200 w-full"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
