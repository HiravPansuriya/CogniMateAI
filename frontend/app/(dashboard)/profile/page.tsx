"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getInitials, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  HiOutlineCalendar,
  HiOutlineArrowRightOnRectangle,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineSparkles,
} from "react-icons/hi2";
import type { DashboardStats } from "@/types";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data || res.data);
      } catch (err: unknown) {
        console.error("Failed to load user stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-secondary/5 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-glow relative z-10">
          {getInitials(user.name)}
        </div>
        <h1 className="text-2xl font-bold text-text-primary relative z-10">{user.name}</h1>
        <p className="text-text-secondary relative z-10">{user.email}</p>
        <div className="flex items-center gap-1.5 text-sm text-text-tertiary mt-2 relative z-10">
          <HiOutlineCalendar className="w-4 h-4" />
          Member since {user.createdAt ? formatDate(user.createdAt) : "recently"}
        </div>
      </div>

      {/* Learning Overview */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineSparkles className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Learning Stats</h2>
        </div>
        
        {loadingStats ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-bg-secondary border border-border-default rounded-xl p-4 space-y-2">
                <div className="h-4 w-1/3 shimmer rounded" />
                <div className="h-6 w-2/3 shimmer rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-secondary border border-border-default rounded-xl p-4 text-center hover:border-accent-primary/20 transition-all">
              <HiOutlineDocumentText className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Notes</p>
              <p className="text-xl font-bold text-text-primary mt-1">{stats?.totalNotes ?? 0}</p>
            </div>
            
            <div className="bg-bg-secondary border border-border-default rounded-xl p-4 text-center hover:border-accent-secondary/20 transition-all">
              <HiOutlineAcademicCap className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Quizzes</p>
              <p className="text-xl font-bold text-text-primary mt-1">{stats?.totalQuizzes ?? 0}</p>
            </div>
            
            <div className="bg-bg-secondary border border-border-default rounded-xl p-4 text-center hover:border-accent-success/20 transition-all">
              <HiOutlineTrophy className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Avg Score</p>
              <p className="text-xl font-bold text-text-primary mt-1">{stats?.avgScore ? `${Math.round(stats.avgScore)}%` : "N/A"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-bg-secondary border border-accent-danger/20 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Danger Zone</h2>
        <p className="text-sm text-text-secondary mb-4">Sign out of your account on this device.</p>
        <Button variant="danger" onClick={handleLogout} icon={<HiOutlineArrowRightOnRectangle className="w-4 h-4" />}>
          Logout
        </Button>
      </div>
    </motion.div>
  );
}
