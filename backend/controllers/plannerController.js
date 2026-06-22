import StudyPlan from "../models/StudyPlan.js";

const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getStudyPlans };
