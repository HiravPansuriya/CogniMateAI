"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  color: string;
}

export default function StatsCard({ icon, title, value, change, changeType, color }: StatsCardProps) {
  return (
    <motion.div
      className="glass-card p-5 group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
          {icon}
        </div>
        {change && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", changeType === "positive" ? "bg-accent-success/15 text-accent-success" : "bg-accent-danger/15 text-accent-danger")}>
            {changeType === "positive" ? "+" : ""}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary mt-3">{value}</p>
      <p className="text-sm text-text-secondary mt-0.5">{title}</p>
    </motion.div>
  );
}
