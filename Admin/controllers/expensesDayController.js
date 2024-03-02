const expensesDaySchema = require("../../models/expensesDay");

const getExpensesDay = async (req, res) => {
  try {
    const userId = req.query.user;
    const month = req.query.month;
    const year = req.query.year;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    console.log(startDate);
    console.log(endDate);
    const expensesDays = await expensesDaySchema
      .find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .select("-createdAt -user -updatedAt")
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
