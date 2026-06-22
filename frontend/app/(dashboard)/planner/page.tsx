"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { StudyPlan, StudyDay, StudyTask } from "@/types";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlineCalendarDays,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

function StudyGoalCard({ task }: { task: StudyTask }) {
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all", task.completed ? "border-accent-success/20 bg-accent-success/5" : "border-border-default bg-bg-tertiary/50 hover:bg-bg-tertiary")}>
      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", task.completed ? "border-accent-success bg-accent-success" : "border-text-tertiary")}>
        {task.completed && <HiOutlineCheckCircle className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", task.completed ? "text-text-tertiary line-through" : "text-text-primary")}>{task.topic}</p>
        <p className="text-xs text-text-secondary">{task.subject}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-text-tertiary flex-shrink-0">
        <HiOutlineClock className="w-3.5 h-3.5" />{task.duration}
      </div>
    </div>
  );
}

function PlannerTimeline({ schedule }: { schedule: StudyDay[] }) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="space-y-6">
      {schedule.map((day, i) => {
        const isToday = day.date === today;
        return (
          <motion.div key={day.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className={cn("w-3 h-3 rounded-full mt-1.5 flex-shrink-0", isToday ? "bg-accent-primary shadow-glow" : "bg-bg-hover")} />
              {i < schedule.length - 1 && <div className="w-0.5 flex-1 bg-border-default mt-1" />}
            </div>
            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className={cn("text-sm font-semibold", isToday ? "text-accent-primary" : "text-text-primary")}>{isToday ? "Today" : formatDate(day.date)}</h3>
                <span className="text-xs text-text-tertiary">{day.totalHours}h</span>
              </div>
              <div className="space-y-2">
                {day.tasks.map((task, j) => <StudyGoalCard key={j} task={task} />)}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PlannerPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    api.get("/planner")
      .then((res) => setPlans(res.data.data || res.data || []))
      .catch((err) => {
        setPlans([]);
        toast.error(err.response?.data?.message || "Failed to fetch study plans");
      })
      .finally(() => setLoading(false));
  }, []);

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const removeSubject = (s: string) => setSubjects(subjects.filter((x) => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addSubject(); }
  };

  const generatePlan = async () => {
    if (subjects.length === 0) return toast.error("Add at least one subject");
    if (!examDate) return toast.error("Select an exam date");
    setGenerating(true);
    try {
      const res = await api.post("/planner/generate", { subjects, examDate, hoursPerDay });
      setGeneratedPlan(res.data.data || res.data);
      toast.success("Study plan generated!");
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to generate plan"); 
    }
    finally { setGenerating(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
          <HiOutlineCalendarDays className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Study Planner</h1>
          <p className="text-text-secondary text-sm">Create personalized study schedules</p>
        </div>
      </div>

      {/* Generator */}
      <div className="glass-card p-6 mx-auto space-y-5">
        <h2 className="text-base font-semibold text-text-primary">Generate Study Plan</h2>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Subjects</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {subjects.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-sm">
                {s}
                <button onClick={() => removeSubject(s)} className="hover:text-accent-danger transition-colors"><HiOutlineXMark className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a subject and press Enter" className="flex-1 bg-bg-tertiary border border-border-default rounded-xl px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary placeholder:text-text-tertiary transition-colors" />
            <Button variant="secondary" size="sm" onClick={addSubject}>Add</Button>
          </div>
        </div>

        {/* Exam Date */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Exam Date</label>
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full bg-bg-tertiary border border-border-default rounded-xl px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors" />
        </div>

        {/* Hours */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Hours per Day: <span className="text-accent-primary font-bold">{hoursPerDay}h</span></label>
          <input type="range" min="1" max="12" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} className="w-full accent-accent-primary cursor-pointer" />
          <div className="flex justify-between text-xs text-text-tertiary mt-1"><span>1h</span><span>6h</span><span>12h</span></div>
        </div>

        <Button variant="primary" size="lg" onClick={generatePlan} isLoading={generating} icon={<HiOutlineCalendarDays className="w-5 h-5" />} className="w-full">
          Generate Study Plan
        </Button>
      </div>

      {/* Generated Plan */}
      {generatedPlan && generatedPlan.schedule && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Your Study Plan</h2>
          <PlannerTimeline schedule={generatedPlan.schedule} />
        </div>
      )}

      {/* Existing Plans */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">My Plans</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="glass-card p-5 space-y-3"><div className="h-4 w-1/3 shimmer rounded" /><div className="h-3 w-full shimmer rounded" /></div>)}
          </div>
        ) : plans.length === 0 && !generatedPlan ? (
          <EmptyState icon={<HiOutlineCalendarDays className="w-8 h-8" />} title="No study plans" description="Generate a personalized study plan to get started" />
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan._id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Plan for {plan.subjects.join(", ")}</p>
                    <p className="text-xs text-text-tertiary">Exam: {formatDate(plan.examDate)} · {plan.hoursPerDay}h/day</p>
                  </div>
                  <span className="text-xs text-text-tertiary">{formatDate(plan.createdAt)}</span>
                </div>
                {plan.schedule && <PlannerTimeline schedule={plan.schedule} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
