"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { Note, Quiz, QuizResult, QuizType, QuizHistory } from "@/types";
import QuizQuestionComponent from "@/components/quiz/QuizQuestion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineTrophy,
} from "react-icons/hi2";

const quizTypes: { value: QuizType; label: string; desc: string }[] = [
  { value: "mcq", label: "Multiple Choice", desc: "Choose the correct answer" },
  { value: "true-false", label: "True / False", desc: "Determine if statements are correct" },
];

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"generate" | "history">("generate");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState(searchParams.get("noteId") || "");
  const [quizType, setQuizType] = useState<QuizType>("mcq");
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // History
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    api.get("/notes")
      .then((res) => setNotes(res.data.data || res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to fetch notes"));
  }, []);

  useEffect(() => {
    if (tab === "history") {
      setLoadingHistory(true);
      api.get("/quiz/history")
        .then((res) => setHistory(res.data.data || res.data || []))
        .catch((err) => {
          setHistory([]);
          toast.error(err.response?.data?.message || "Failed to fetch quiz history");
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [tab]);

  const generateQuiz = async () => {
    if (!selectedNote) return toast.error("Please select a note");
    setGenerating(true);
    try {
      const res = await api.post("/quiz/generate", { noteId: selectedNote, type: quizType, count: questionCount });
      setActiveQuiz(res.data.data || res.data);
      setCurrentQ(0);
      setAnswers({});
      setResult(null);
      setSelectedResult(null);
      toast.success("Quiz generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const res = await api.post("/quiz/submit", { quizId: activeQuiz._id, answers });
      setResult(res.data.data || res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const viewHistoryDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/quiz/result/${id}`);
      setSelectedResult(res.data.data || res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch quiz details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Detailed History View
  if (selectedResult) {
    const quiz = selectedResult.quizId as Quiz;
    const pct = selectedResult.percentage || Math.round((selectedResult.score / selectedResult.totalQuestions) * 100);
    const color = pct >= 80 ? "text-accent-success" : pct >= 50 ? "text-accent-warning" : "text-accent-danger";
    const unattempted = selectedResult.unattemptedCount || 0;
    const incorrect = selectedResult.totalQuestions - selectedResult.score - unattempted;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => setSelectedResult(null)} icon={<HiOutlineArrowLeft className="w-4 h-4" />}>
            Back to History
          </Button>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{quiz?.title || "Quiz Details"}</h2>
            <p className="text-sm text-text-secondary">{formatDate(selectedResult.createdAt)}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-text-secondary mb-1">Overall Performance</p>
            <h3 className={`text-4xl font-bold ${color}`}>{pct}%</h3>
            <p className="text-sm text-text-tertiary mt-1">
              {selectedResult.score} / {selectedResult.totalQuestions} questions correct
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-3 rounded-xl bg-accent-success/10 border border-accent-success/20 text-center min-w-[100px]">
              <p className="text-xl font-bold text-accent-success">{selectedResult.score}</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary">Correct</p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-accent-danger/10 border border-accent-danger/20 text-center min-w-[100px]">
              <p className="text-xl font-bold text-accent-danger">{incorrect}</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary">Incorrect</p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-accent-warning/10 border border-accent-warning/20 text-center min-w-[100px]">
              <p className="text-xl font-bold text-accent-warning">{unattempted}</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary">Skipped</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">Question Review</h3>
          {quiz?.questions.map((q, idx) => {
            const userResult = selectedResult.results.find(r => r.questionId === q._id);
            return (
              <div key={q._id} className="glass-card p-6 space-y-4">
                <QuizQuestionComponent
                  question={q}
                  index={idx}
                  total={quiz.questions.length}
                  selectedAnswer={userResult?.userAnswer || ""}
                  onAnswer={() => {}}
                  showResult={true}
                  correctAnswer={userResult?.correctAnswer || q.correctAnswer}
                  isSkipped={userResult?.isSkipped}
                />
                {userResult?.explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-bg-tertiary/50 border border-border-default">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Explanation</p>
                    <p className="text-sm text-text-primary leading-relaxed">{userResult.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Result view (after taking a quiz)
  if (result) {
    const pct = result.percentage || Math.round((result.score / result.totalQuestions) * 100);
    const color = pct >= 80 ? "text-accent-success" : pct >= 50 ? "text-accent-warning" : "text-accent-danger";
    const unattempted = result.unattemptedCount || 0;
    const incorrect = result.totalQuestions - result.score - unattempted;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-8 text-center">
          <HiOutlineTrophy className={`w-16 h-16 mx-auto mb-4 ${color}`} />
          <h2 className="text-3xl font-bold text-text-primary mb-1">{pct}%</h2>
          <p className="text-text-secondary">You got {result.score} out of {result.totalQuestions} correct</p>
          <div className="flex justify-center gap-6 mt-8">
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold text-accent-success">{result.score}</p>
              <p className="text-xs font-medium text-text-secondary uppercase">Correct</p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold text-accent-danger">{incorrect}</p>
              <p className="text-xs font-medium text-text-secondary uppercase">Incorrect</p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold text-accent-warning">{unattempted}</p>
              <p className="text-xs font-medium text-text-secondary uppercase">Skipped</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={() => { setActiveQuiz(null); setResult(null); }}>Try Again</Button>
          <Button variant="secondary" onClick={() => { setActiveQuiz(null); setResult(null); setTab("history"); }}>View History</Button>
        </div>
      </motion.div>
    );
  }

  // Active quiz view
  if (activeQuiz) {
    const q = activeQuiz.questions[currentQ];
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
        {/* Question */}
        <QuizQuestionComponent
          question={q}
          index={currentQ}
          total={activeQuiz.questions.length}
          selectedAnswer={answers[q._id] || ""}
          onAnswer={(a) => setAnswers((prev) => ({ ...prev, [q._id]: a }))}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => setCurrentQ((p) => p - 1)} disabled={currentQ === 0} icon={<HiOutlineArrowLeft className="w-4 h-4" />}>
            Previous
          </Button>
          {currentQ === activeQuiz.questions.length - 1 ? (
            <Button variant="primary" onClick={submitQuiz} isLoading={submitting} icon={<HiOutlineCheckCircle className="w-4 h-4" />}>
              Submit Quiz
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setCurrentQ((p) => p + 1)} icon={<HiOutlineArrowRight className="w-4 h-4" />}>
              Next
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <HiOutlineAcademicCap className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quiz</h1>
          <p className="text-text-secondary text-sm">Test your knowledge with AI-generated quizzes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-secondary rounded-xl border border-border-default w-fit">
        {(["generate", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${tab === t ? "gradient-bg text-white" : "text-text-secondary hover:text-text-primary"}`}>
            {t === "generate" ? "Generate Quiz" : "History"}
          </button>
        ))}
      </div>

      {tab === "generate" ? (
        <div className="space-y-6 ">
          {/* Note select */}
          <div className="glass-card p-5">
            <label className="block text-sm font-medium text-text-secondary mb-2">Select a Note</label>
            <Select
              value={selectedNote}
              onChange={setSelectedNote}
              options={notes.map((n) => ({ value: n._id, label: n.title }))}
              placeholder="Choose a note..."
              className="w-full"
            />
          </div>

          {/* Quiz Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Quiz Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quizTypes.map((qt) => (
                <button key={qt.value} onClick={() => setQuizType(qt.value)} className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${quizType === qt.value ? "border-accent-primary bg-accent-primary/5" : "border-border-default bg-bg-secondary hover:border-border-hover"}`}>
                  <p className="text-sm font-medium text-text-primary">{qt.label}</p>
                  <p className="text-xs text-text-secondary mt-1">{qt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="glass-card p-5">
            <label className="block text-sm font-medium text-text-secondary mb-3">Number of Questions: <span className="text-accent-primary font-bold">{questionCount}</span></label>
            <input type="range" min="5" max="20" step="5" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full accent-accent-primary cursor-pointer" />
            <div className="flex justify-between text-xs text-text-tertiary mt-1"><span>5</span><span>10</span><span>15</span><span>20</span></div>
          </div>

          <Button variant="primary" size="lg" onClick={generateQuiz} isLoading={generating} icon={<HiOutlineAcademicCap className="w-5 h-5" />} className="w-full">
            Generate Quiz
          </Button>
        </div>
      ) : (
        <div>
          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="glass-card p-5 space-y-3"><div className="h-4 w-2/3 shimmer rounded" /><div className="h-3 w-1/3 shimmer rounded" /></div>)}
            </div>
          ) : history.length === 0 ? (
            <EmptyState icon={<HiOutlineAcademicCap className="w-8 h-8" />} title="No quiz history" description="Take your first quiz to see results here" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((h) => {
                const pct = h.percentage || Math.round((h.score / h.totalQuestions) * 100);
                const color = pct >= 80 ? "text-accent-success" : pct >= 50 ? "text-accent-warning" : "text-accent-danger";
                const isSelected = loadingDetails && selectedResult?._id === h._id;

                return (
                  <button
                    key={h._id}
                    onClick={() => viewHistoryDetails(h._id)}
                    disabled={loadingDetails}
                    className="glass-card p-5 text-left hover:border-accent-primary/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-text-primary group-hover:text-accent-primary transition-colors">{h.quiz?.title || "Quiz"}</p>
                        <Badge variant="default" className="mt-1">{h.quiz?.type || "mcq"}</Badge>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${color}`}>{pct}%</p>
                        {loadingDetails && isSelected && (
                          <div className="flex justify-end mt-1">
                            <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-text-tertiary">{formatDate(h.createdAt)}</p>
                      <span className="text-xs font-medium text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
