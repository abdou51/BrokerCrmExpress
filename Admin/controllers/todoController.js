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
const getTodosPerMonth = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    const sortBy = req.query.sortBy || "startDate";
    const sortDirection = req.query.sortDirection || "desc";
    const user = req.query.user;

    if (!year || !month || !user) {
      return res
        .status(400)
        .json({ message: "Year, month, and user parameters are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortDirection === "desc" ? -1 : 1 },
    };

    const query = {
      target: user,
      startDate: { $gte: startDate, $lte: endDate },
    };

    const result = await Todo.paginate(query, options);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodosPerMonth,
};
