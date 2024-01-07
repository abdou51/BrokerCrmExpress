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

module.exports = {
  createGoal,
};
