const expensesDaySchema = require("../../models/expensesDay");

const getExpensesDay = async (req, res) => {
  try {
    const userId = req.query.user;
    let startDate;
    let endDate;
    let month;
    let year;

    if (!startDate || !endDate) {
      month = req.query.month;
      year = req.query.year;
      startDate = new Date(year, month - 1, 1);
      startDate.setHours(startDate.getHours() - 1);
      endDate = new Date(year, month, -1);
      endDate.setHours(23, 0, 0, 0);
    } else {
      startDate = new Date(req.query.startDate);
      startDate.setHours(startDate.getHours() - 1);
      endDate = new Date(req.query.endDate);
      endDate.setHours(startDate.getHours() - 1);
    }
    const expensesDays = await expensesDaySchema
      .find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .select("-createdAt -updatedAt")
      .sort({ date: 1 });

    res.status(200).json(expensesDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  getExpensesDay,
};
