const Todo = require("../../models/todo");

const syncTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const filter = {
      user: userId,
      endDate: { $lt: now },
      status: "Pending",
    };
    const update = { status: "Ignored" };
    await Todo.updateMany(filter, update);
    res.status(200).json({ success: true, message: "Todos Synced" });
  } catch (error) {
    res.status(500).json({ error: "Error Syncing Todos" });
    console.error(error);
  }
};

module.exports = {
  syncTodos,
};
