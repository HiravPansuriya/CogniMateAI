import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";

const getQuizHistory = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .populate("quizId")
      .sort({ createdAt: -1 });

    const history = results.map((r) => ({
      _id: r._id,
      quiz: r.quizId,
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: r.percentage,
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuizResultDetails = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.id).populate("quizId");
    if (!result) {
      return res.status(404).json({ success: false, message: "Quiz result not found" });
    }
    if (result.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getQuizHistory, getQuizResultDetails };

