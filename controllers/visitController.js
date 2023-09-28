const Visit = require("../models/visit");
const Task = require("../models/task");

const createVisit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { task: taskId, visitLocation, createdDate } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    console.log(task.user.toString());
    if (task.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only create visits for your own tasks." });
    }

    const newVisit = new Visit({
      task: taskId,
      visitLocation,
      createdDate,
    });

    const createdVisit = await newVisit.save();

    res.status(201).json(createdVisit);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the Visit." });
    console.log(error);
  }
};

module.exports = {
  createVisit,
};
