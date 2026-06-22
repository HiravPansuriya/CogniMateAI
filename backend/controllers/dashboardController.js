import Note from "../models/Note.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Activity from "../models/Activity.js";

const getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ user: req.user._id });
    const totalQuizzes = await QuizResult.countDocuments({ user: req.user._id });

    const quizResults = await QuizResult.find({ user: req.user._id });
    const avgScore =
      quizResults.length > 0
        ? quizResults.reduce((acc, curr) => acc + curr.percentage, 0) /
          quizResults.length
        : 0;

    const recentActivity = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const notes = await Note.find({ user: req.user._id });
    const subjectDistribution = notes.reduce((acc, note) => {
      const subject = note.subject;
      const existing = acc.find((s) => s.subject === subject);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ subject, count: 1 });
      }
      return acc;
    }, []);

    const quizPerformance = quizResults.map((r) => ({
      date: r.createdAt.toISOString().split("T")[0],
      score: r.percentage,
    }));

    res.json({
      success: true,
      data: {
        totalNotes,
        totalQuizzes,
        avgScore,
        studyHours: 0, // Placeholder
        recentActivity,
        subjectDistribution,
        quizPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getDashboardStats };
