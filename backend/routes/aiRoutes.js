import express from "express";
import {
  generateSummary,
  askQuestion,
  generateQuiz,
  submitQuiz,
  generateFlashcards,
  generateStudyPlan,
  getChatHistory,
} from "../controllers/aiController.js";
import { getQuizHistory, getQuizResultDetails } from "../controllers/quizController.js";
import {
  getFlashcards,
  deleteFlashcardDeck,
} from "../controllers/flashcardController.js";
import { getStudyPlans } from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Summary
router.post("/summary/generate", protect, generateSummary);

// Chat
router.post("/chat/ask", protect, askQuestion);
router.get("/chat/history/:noteId", protect, getChatHistory);

// Quiz
router.post("/quiz/generate", protect, generateQuiz);
router.post("/quiz/submit", protect, submitQuiz);
router.get("/quiz/history", protect, getQuizHistory);
router.get("/quiz/result/:id", protect, getQuizResultDetails);

// Flashcards
router.post("/flashcards/generate", protect, generateFlashcards);
router.get("/flashcards", protect, getFlashcards);
router.delete("/flashcards/:id", protect, deleteFlashcardDeck);

// Planner
router.post("/planner/generate", protect, generateStudyPlan);
router.get("/planner", protect, getStudyPlans);

export default router;
