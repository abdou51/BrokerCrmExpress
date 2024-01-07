const ExpensesDay = require("../models/expensesDay");
const ExpensesUser = require("../models/expensesUser");

const getExpensesDay = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).send("Missing Date in Query");
    }
    const yearMonth = date.split("-").slice(0, 2).join("-");
    const userId = req.user.userId;

    const expensesUser = await ExpensesUser.findOne({
      user: userId,
      createdDate: yearMonth,
    });

    if (!expensesUser) {
      return res.status(404).json({ message: "ExpensesUser not found" });
    }

    const expensesDay = await ExpensesDay.findOne({
      userExpense: expensesUser.id,
      createdDate: date,
    });

    if (!expensesDay) {
      return res
        .status(404)
        .json({ message: "The Expense Day cannot be found!" });
    }

    res.status(200).json(expensesDay);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
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
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};

module.exports = {
  getExpensesDay,
  updateExpenseDay,
};
