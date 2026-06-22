"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface QuizPerformanceChartProps {
  data: { date: string; score: number }[];
}

export default function QuizPerformanceChart({ data }: QuizPerformanceChartProps) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Score %",
        data: data.map((d) => d.score),
        borderColor: "#6366F1",
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea: { bottom: number; top: number } | undefined } }) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea?.top || 0, 0, ctx.chart.chartArea?.bottom || 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#0B0F19",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#9CA3AF",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(55, 65, 81, 0.3)", drawBorder: false },
        ticks: { color: "#6B7280", font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(55, 65, 81, 0.3)", drawBorder: false },
        ticks: { color: "#6B7280", font: { size: 11 }, callback: (v: string | number) => v + "%" },
      },
    },
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Quiz Performance</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
