const ExpensesDay = require("../models/expensesDay");
const ExpensesUser = require("../models/expensesUser");

const getExpensesDay = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log(currentDate);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const userId = req.user.userId;
    const formattedDate = `${year}-${month}`;
    const expensesUser = await ExpensesUser.findOne({
      user: userId,
      createdDate: formattedDate,
    });
    console.log(expensesUser);
    const expensesDay = await ExpensesDay.findOne({
      userExpense: expensesUser.id,
      createdDate: `${year}-${month}-${day}`,
    });
    res.status(200).json(expensesDay);
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};

module.exports = {
  getExpensesDay,
};
