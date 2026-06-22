"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SubjectDistributionProps {
  data: { subject: string; count: number }[];
}

const COLORS = ["#6366F1", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];

export default function SubjectDistribution({ data }: SubjectDistributionProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  const chartData = {
    labels: data.map((d) => d.subject),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "#111827",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#9CA3AF",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Subject Distribution</h3>
      <div className="relative h-48 flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-text-primary">{total}</p>
          <p className="text-xs text-text-secondary">Total Notes</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((d, i) => (
          <div key={d.subject} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-text-secondary truncate">{d.subject}</span>
            <span className="text-text-primary font-medium ml-auto">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
