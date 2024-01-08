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
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Error getting Goals" });
    console.error(error);
  }
};

module.exports = {
  createGoal,
};
