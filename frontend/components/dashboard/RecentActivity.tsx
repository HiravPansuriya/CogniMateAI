"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import {
  HiOutlineCloudArrowUp,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineRectangleStack,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  upload: { icon: HiOutlineCloudArrowUp, color: "bg-blue-500/15 text-blue-400" },
  quiz: { icon: HiOutlineAcademicCap, color: "bg-violet-500/15 text-violet-400" },
  summary: { icon: HiOutlineSparkles, color: "bg-indigo-500/15 text-indigo-400" },
  chat: { icon: HiOutlineChatBubbleLeftRight, color: "bg-emerald-500/15 text-emerald-400" },
  flashcard: { icon: HiOutlineRectangleStack, color: "bg-amber-500/15 text-amber-400" },
  planner: { icon: HiOutlineCalendarDays, color: "bg-rose-500/15 text-rose-400" },
};

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-text-tertiary text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, i) => {
            const config = typeConfig[activity.type] || typeConfig.upload;
            const Icon = config.icon;
            return (
              <motion.div
                key={activity._id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-tertiary/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{activity.title}</p>
                  <p className="text-xs text-text-secondary truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-text-tertiary whitespace-nowrap flex-shrink-0">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
