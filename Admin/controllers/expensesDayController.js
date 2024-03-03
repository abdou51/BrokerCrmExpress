const expensesDaySchema = require("../../models/expensesDay");

const getExpensesDay = async (req, res) => {
  try {
    const userId = req.query.user;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    if (!startDate || !endDate) {
      const month = req.query.month;
      const year = req.query.year;
      startDate = new Date(year, month - 1, 1);
      startDate.setHours(startDate.getHours() - 1);
      endDate = new Date(year, month, -1);
      endDate.setHours(23, 0, 0, 0);
    } else {
      startDate = new Date(startDate);
      startDate.setHours(startDate.getHours() - 1);
      endDate = new Date(endDate);
      endDate.setHours(startDate.getHours() - 1);
    }
    let year = 2024;
    let month = 1; // Note: JavaScript counts months from 0 (January) to 11 (December).
    let day = 1;

    let date = new Date(Date.UTC(year, month, day));
    let date2 = new Date(year, month, day);
    console.log(date);
    console.log(date2);
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
