"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getGreeting } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import StatsCard from "@/components/dashboard/StatsCard";
import QuizPerformanceChart from "@/components/dashboard/QuizPerformanceChart";
import SubjectDistribution from "@/components/dashboard/SubjectDistribution";
import RecentActivity from "@/components/dashboard/RecentActivity";
import type { DashboardStats } from "@/types";
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCloudArrowUp,
  HiOutlineRectangleStack,
  HiOutlineCalendarDays,
  HiOutlineArrowRight,
} from "react-icons/hi2";

const defaultStats: DashboardStats = {
  totalNotes: 0,
  totalQuizzes: 0,
  avgScore: 0,
  studyHours: 0,
  recentActivity: [],
  subjectDistribution: [
    { subject: "Mathematics", count: 5 },
    { subject: "Physics", count: 3 },
    { subject: "Chemistry", count: 4 },
    { subject: "Biology", count: 2 },
  ],
  quizPerformance: [
    { date: "Week 1", score: 65 },
    { date: "Week 2", score: 72 },
    { date: "Week 3", score: 58 },
    { date: "Week 4", score: 81 },
    { date: "Week 5", score: 75 },
    { date: "Week 6", score: 88 },
  ],
};

const quickActions = [
  { href: "/notes", icon: HiOutlineCloudArrowUp, label: "Upload Notes", color: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20" },
  { href: "/quiz", icon: HiOutlineAcademicCap, label: "Start Quiz", color: "bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20" },
  { href: "/flashcards", icon: HiOutlineRectangleStack, label: "Flashcards", color: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20" },
  // { href: "/planner", icon: HiOutlineCalendarDays, label: "Study Plan", color: "bg-red-500/10 text-red-400 group-hover:bg-red-500/20" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data || res.data);
      } catch (err: any) {
        setStats(defaultStats);
        toast.error(err.response?.data?.message || "Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">
          {getGreeting()}, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-text-secondary mt-1">Here&apos;s your learning overview</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={<HiOutlineDocumentText className="w-5 h-5 text-blue-400" />} title="Total Notes" value={loading ? "—" : stats.totalNotes} color="bg-blue-500/10" />
        <StatsCard icon={<HiOutlineAcademicCap className="w-5 h-5 text-violet-400" />} title="Quizzes Taken" value={loading ? "—" : stats.totalQuizzes} color="bg-violet-500/10" />
        <StatsCard icon={<HiOutlineChartBar className="w-5 h-5 text-emerald-400" />} title="Avg Score" value={loading ? "—" : `${stats.avgScore}%`} color="bg-emerald-500/10" change={loading ? undefined : ""} changeType="positive" />
        {/* <StatsCard icon={<HiOutlineClock className="w-5 h-5 text-red-400" />} title="Study Hours" value={loading ? "—" : stats.studyHours} color="bg-red-500/10" /> */}
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuizPerformanceChart data={stats.quizPerformance} />
        </div>
        <SubjectDistribution data={stats.subjectDistribution} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-text-primary mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="glass-card p-4 flex items-center gap-3 group cursor-pointer hover:border-accent-primary/20">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-text-primary">{action.label}</span>
                <HiOutlineArrowRight className="w-4 h-4 text-text-tertiary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <RecentActivity activities={stats.recentActivity} />
      </motion.div>
    </motion.div>
  );
}
