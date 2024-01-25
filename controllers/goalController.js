const Goal = require("../models/goal");

const createGoal = async (req, res) => {
  try {
    const goalData = { ...req.body };
    const createdGoal = await Goal.create(goalData);

    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(500).json({ error: "Error creating Goal" });
    console.error(error);
  }
};

const updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: "Error updating Goal" });
    console.error(error);
  }
};
const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Getting the first and last day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const goals = await Goal.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      { $match: { "userData.createdBy": mongoose.Types.ObjectId(userId) } },
      { $project: { totalSales: 1, totalVisits: 1, user: "$userData" } },
    ]);

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Error getting Goals" });
    console.error(error);
  }
};

module.exports = {
  createGoal,
};
