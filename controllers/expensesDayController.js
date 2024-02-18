const ExpensesDay = require("../models/expensesDay");
const mongoose = require("mongoose");

const getExpensesDays = async (req, res) => {
  try {
    const year = req.query.year;
    const month = req.query.month - 1;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const userId = req.user.userId;

    const expensesDays = await ExpensesDay.find({
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });
    console.log(expensesDays);
    res.status(200).json(expensesDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExpenseDay = async (req, res) => {
  try {
    const expensesDayId = req.params.id;

    const expensesDayExist = await ExpensesDay.findById(expensesDayId);

    if (!expensesDayExist) {
      return res.status(400).json({ error: "Expenses Day cannot be found!" });
    }
    const updatedExpensesDay = await ExpensesDay.findByIdAndUpdate(
      expensesDayId,
      {
        kmTotal: req.body.kmTotal,
        indemnityKm: req.body.indemnityKm,
        nightsTotal: req.body.nightsTotal,
        indemnityNights: req.body.indemnityNights,
        otherExpenses: req.body.otherExpenses,
        startWilaya: req.body.startWilaya,
        startCity: req.body.startCity,
        endWilaya: req.body.endWilaya,
        endCity: req.body.endCity,
      },
      { new: true }
    );
    if (updatedExpensesDay) {
      return res.status(200).json(updatedExpensesDay);
    } else {
      return res.status(500).json({ error: "Failed to update ExpensesDay" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
};

module.exports = {
  getExpensesDays,
  updateExpenseDay,
};
