"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAcademicCap,
  HiOutlineRectangleStack,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineCloudArrowUp,
  HiOutlineCpuChip,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

const features = [
  { icon: HiOutlineSparkles, title: "AI Summaries", desc: "Generate concise summaries, extract key concepts, and create exam-focused notes instantly." },
  { icon: HiOutlineChatBubbleLeftRight, title: "Chat with Notes", desc: "Ask questions about your notes and get context-aware AI responses with source references." },
  { icon: HiOutlineAcademicCap, title: "Smart Quizzes", desc: "Auto-generated MCQs, True/False, and fill-in-the-blank questions to test your knowledge." },
  { icon: HiOutlineRectangleStack, title: "Flashcards", desc: "Create and review AI-generated flashcards for efficient memorization and revision." },
  { icon: HiOutlineCalendarDays, title: "Study Planner", desc: "Personalized study schedules based on your exam dates, subjects, and daily goals." },
  { icon: HiOutlineChartBarSquare, title: "Analytics", desc: "Track your progress with detailed performance insights and learning activity history." },
];

const steps = [
  { icon: HiOutlineCloudArrowUp, title: "Upload Your Notes", desc: "Upload PDFs or paste text notes organized by subject." },
  { icon: HiOutlineCpuChip, title: "AI Analyzes Content", desc: "Our AI processes and deeply understands your study materials." },
  { icon: HiOutlineRocketLaunch, title: "Learn Smarter", desc: "Get summaries, quizzes, flashcards, study plans and more." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <HiOutlineAcademicCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">CogniMateAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium gradient-bg text-white rounded-xl hover:shadow-lg hover:shadow-accent-primary/25 transition-all btn-lift">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 mesh-gradient">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-primary/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent-secondary/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-8">
              <HiOutlineSparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-accent-primary font-medium">Powered by AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Study Smarter<br />
              <span className="gradient-text">with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your study materials into interactive learning experiences.
              Upload notes, get AI summaries, take quizzes, review flashcards, and ace your exams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 text-base font-semibold gradient-bg text-white rounded-xl hover:shadow-xl hover:shadow-accent-primary/25 transition-all btn-lift">
                Get Started Free
              </Link>
              <Link href="/login" className="px-8 py-3.5 text-base font-semibold bg-transparent text-text-primary border border-border-default rounded-xl hover:bg-bg-tertiary transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              A complete suite of AI-powered tools designed to make your study sessions more productive and effective.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <div className="glass-card p-6 h-full group hover:border-accent-primary/30">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-accent-primary/50 via-accent-secondary/50 to-accent-primary/50" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center mb-6 relative z-10 shadow-glow">
                  <step.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-bg-primary border-2 border-accent-primary flex items-center justify-center text-xs font-bold text-accent-primary">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your<br />
                <span className="gradient-text">Study Experience?</span>
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of students using AI to study smarter, not harder.
              </p>
              <Link href="/register" className="inline-flex px-8 py-3.5 text-base font-semibold gradient-bg text-white rounded-xl hover:shadow-xl hover:shadow-accent-primary/25 transition-all btn-lift">
                Get Started Free
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border-default">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="w-5 h-5 text-accent-primary" />
            <span className="text-sm text-text-secondary">
              CogniMateAI © 2026. Built for students, powered by AI.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/login" className="hover:text-text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-text-primary transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
