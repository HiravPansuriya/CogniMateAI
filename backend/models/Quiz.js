import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ["mcq", "true-false"],
    required: true,
  },
  options: [
    {
      label: String,
      text: String,
    },
  ],
  correctAnswer: { type: String, required: true },
  explanation: String,
});

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Note",
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "true-false"],
      required: true,
    },
    questions: [quizQuestionSchema],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
