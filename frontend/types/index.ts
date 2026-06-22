// ============================================
// CogniMateAI — TypeScript Interfaces
// ============================================

// --- User & Auth ---
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse extends ApiResponse<User & { token: string }> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// --- Notes ---
export interface Note {
  _id: string;
  title: string;
  content: string;
  subject: string;
  fileUrl?: string;
  fileType?: "pdf" | "text";
  pageCount?: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteUploadData {
  file?: File;
  title: string;
  content?: string;
  subject: string;
}

// --- AI Summary ---
export interface Summary {
  _id: string;
  noteId: string;
  content: string;
  keyConcepts: string[];
  definitions: string[];
  examNotes: string[];
  createdAt: string;
}

// --- Chat ---
export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  createdAt: string;
}

export interface ChatRequest {
  noteId: string;
  question: string;
}

// --- Quiz ---
export type QuizType = "mcq" | "true-false";

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  type: QuizType;
  options?: QuizOption[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  noteId: string;
  title: string;
  type: QuizType;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string>;
}

export interface QuizResult {
  _id: string;
  quizId: string | Quiz;
  score: number;
  totalQuestions: number;
  percentage: number;
  unattemptedCount?: number;
  results: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    isSkipped?: boolean;
    explanation?: string;
  }[];
  createdAt: string;
}

export interface QuizHistory {
  _id: string;
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
}

// --- Flashcards ---
export interface Flashcard {
  _id: string;
  front: string;
  back: string;
}

export interface FlashcardDeck {
  _id: string;
  noteId: string;
  title: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
}

// --- Study Planner ---
export interface StudyTask {
  subject: string;
  topic: string;
  duration: string;
  completed: boolean;
}

export interface StudyDay {
  date: string;
  tasks: StudyTask[];
  totalHours: number;
}

export interface StudyPlan {
  _id: string;
  subjects: string[];
  examDate: string;
  hoursPerDay: number;
  schedule: StudyDay[];
  createdAt: string;
}

export interface PlannerRequest {
  subjects: string[];
  examDate: string;
  hoursPerDay: number;
}

// --- Dashboard ---
export interface DashboardStats {
  totalNotes: number;
  totalQuizzes: number;
  avgScore: number;
  studyHours: number;
  recentActivity: ActivityItem[];
  subjectDistribution: { subject: string; count: number }[];
  quizPerformance: { date: string; score: number }[];
}

export interface ActivityItem {
  _id: string;
  type: "upload" | "quiz" | "summary" | "chat" | "flashcard" | "planner";
  title: string;
  description: string;
  createdAt: string;
}

// --- API Response Wrapper ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
