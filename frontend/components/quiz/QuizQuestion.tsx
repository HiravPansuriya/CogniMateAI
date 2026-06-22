"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import type { QuizQuestion as QuizQuestionType } from "@/types";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  total: number;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  correctAnswer?: string;
  isSkipped?: boolean;
}

export default function QuizQuestion({
  question,
  index,
  total,
  selectedAnswer,
  onAnswer,
  showResult = false,
  correctAnswer,
  isSkipped = false,
}: QuizQuestionProps) {
  const optionLabels = ["A", "B", "C", "D"];

  const getOptionStyle = (optionLabel: string) => {
    if (!showResult) {
      return selectedAnswer === optionLabel
        ? "border-accent-primary bg-accent-primary/10 ring-2 ring-accent-primary/30"
        : "border-border-default hover:border-border-hover hover:bg-bg-hover/50 cursor-pointer";
    }
    if (optionLabel === correctAnswer) {
      return "border-accent-success bg-accent-success/10 ring-2 ring-accent-success/30";
    }
    if (optionLabel === selectedAnswer && optionLabel !== correctAnswer) {
      return "border-accent-danger bg-accent-danger/10 ring-2 ring-accent-danger/30";
    }
    return "border-border-default opacity-50";
  };

  return (
    <motion.div
      key={question._id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          Question <span className="text-text-primary font-semibold">{index + 1}</span> of{" "}
          <span className="text-text-primary font-semibold">{total}</span>
        </span>
        <span className="text-xs text-text-tertiary px-3 py-1 rounded-full bg-bg-tertiary capitalize">
          {question.type === "mcq" ? "Multiple Choice" : "True / False"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-bg rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-semibold text-text-primary leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      {question.type === "mcq" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button
              key={option.label}
              onClick={() => !showResult && onAnswer(option.label)}
              disabled={showResult}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                getOptionStyle(option.label)
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                  selectedAnswer === option.label && !showResult
                    ? "gradient-bg text-white"
                    : showResult && option.label === correctAnswer
                    ? "bg-accent-success text-white"
                    : showResult && option.label === selectedAnswer
                    ? "bg-accent-danger text-white"
                    : "bg-bg-tertiary text-text-secondary"
                )}
              >
                {optionLabels[i]}
              </span>
              <span className="text-sm text-text-primary flex-1">{option.text}</span>
              {showResult && option.label === correctAnswer && (
                <HiOutlineCheckCircle className="w-5 h-5 text-accent-success flex-shrink-0" />
              )}
              {showResult && option.label === selectedAnswer && option.label !== correctAnswer && (
                <HiOutlineXCircle className="w-5 h-5 text-accent-danger flex-shrink-0" />
              )}
            </button>
          ))}
          {showResult && (isSkipped || selectedAnswer === "Unattempted") && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-warning/10 border border-accent-warning/20">
              <HiOutlineXCircle className="w-5 h-5 text-accent-warning" />
              <p className="text-sm font-medium text-accent-warning">Question was not attempted</p>
            </div>
          )}
        </div>
      )}

      {/* True/False */}
      {question.type === "true-false" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {["True", "False"].map((val) => (
              <button
                key={val}
                onClick={() => !showResult && onAnswer(val)}
                disabled={showResult}
                className={cn(
                  "p-6 rounded-xl border text-center font-semibold text-lg transition-all duration-200",
                  getOptionStyle(val)
                )}
              >
                <span
                  className={cn(
                    showResult && val === correctAnswer
                      ? "text-accent-success"
                      : showResult && val === selectedAnswer && val !== correctAnswer
                      ? "text-accent-danger"
                      : selectedAnswer === val
                      ? "text-accent-primary"
                      : "text-text-primary"
                  )}
                >
                  {val}
                </span>
                {showResult && val === correctAnswer && (
                  <HiOutlineCheckCircle className="w-5 h-5 text-accent-success mx-auto mt-2" />
                )}
                {showResult && val === selectedAnswer && val !== correctAnswer && (
                  <HiOutlineXCircle className="w-5 h-5 text-accent-danger mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>
          {showResult && (isSkipped || selectedAnswer === "Unattempted") && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-warning/10 border border-accent-warning/20">
              <HiOutlineXCircle className="w-5 h-5 text-accent-warning" />
              <p className="text-sm font-medium text-accent-warning">Question was not attempted</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
