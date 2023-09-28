const Task = require("../models/task");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const mongoosePaginate = require("mongoose-paginate-v2");

const createTask = async (req, res) => {
  try {
    const { client, visitDate } = req.body;

    const user = req.user.userId;
    const newTask = new Task({
      client,
      user: user,
      visitDate,
    });

    const createdTask = await newTask.save();

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the task." });
    console.log(error);
  }
};
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID." });
    }

    const removedTask = await Task.findByIdAndRemove(taskId);

    if (!removedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove the task." });
    console.log(error);
  }
};

const getTodaysTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const date = req.query.date;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const options = {
      page: page,
      limit: perPage,
    };

    const query = { user: userId, visitDate: date };

    const result = await Task.paginate(query, options);

    res.json({
      data: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalDocs,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user's tasks." });
    console.log(error);
  }
};

const cloneTasks = async (req, res) => {
  try {
    const { clients, visitDate } = req.body;
    const user = req.user.userId;
    console.log(visitDate);
    const createdTasks = [];

    for (const client of clients) {
      const newTask = new Task({
        client,
        user,
        visitDate,
      });

      const createdTask = await newTask.save();
      createdTasks.push(createdTask);
    }

    res.status(201).json(createdTasks);
  } catch (error) {
    res.status(400).json({ error: "Failed to create tasks." });
    console.log(error);
  }
};

module.exports = {
  createTask,
  deleteTask,
  getTodaysTasks,
  cloneTasks,
};
