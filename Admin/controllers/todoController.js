const Todo = require("../../models/todo");

const createTodo = async (req, res) => {
  try {
    if (req.user.role !== "Supervisor" && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const assignerId = req.user.userId;
    const todo = new Todo({
      ...req.body,
      assigner: assignerId,
    });
    const createdTodo = await todo.save();
    res.status(200).json(createdTodo);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error Creating Task", error: error.message });
  }
};

module.exports = {
  createTodo,
};
