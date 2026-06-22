import mongoose from "mongoose";

const studyTaskSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  duration: String,
  completed: { type: Boolean, default: false },
});

const studyDaySchema = new mongoose.Schema({
  date: String,
  tasks: [studyTaskSchema],
  totalHours: Number,
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subjects: [String],
    examDate: String,
    hoursPerDay: Number,
    schedule: [studyDaySchema],
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;
