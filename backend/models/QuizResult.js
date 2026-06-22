import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    unattemptedCount: {
      type: Number,
      default: 0,
    },
    results: [
      {
        questionId: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        isSkipped: { type: Boolean, default: false },
        explanation: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;
