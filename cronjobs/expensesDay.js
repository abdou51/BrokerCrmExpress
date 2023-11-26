const ExpensesUser = require("../models/expensesUser");
const ExpensesDay = require("../models/expensesDay");
const User = require("../models/user");
const cron = require("node-cron");
const ExpensesConfig = require("../models/expensesConfig");

cron.schedule("5 0 * * *", async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}`;

  try {
    const users = await User.find();
    const expensesConfig = await ExpensesConfig.findOne();

    for (const user of users) {
      if (user.role !== "Admin" && user.role !== "Supervisor") {
        const existingExpensesUser = await ExpensesUser.findOne({
          user: user.id,
          createdDate: formattedDate,
        });

        if (existingExpensesUser) {
          const newExpensesDay = new ExpensesDay({
            userExpense: existingExpensesUser.id,
            createdDate: `${year}-${month}-${day}`,
          });
          await newExpensesDay.save();
        } else {
          const createdExpensesUser = await ExpensesUser.create({
            user: user.id,
            expensesConfig: expensesConfig.id,
            createdDate: formattedDate,
          });
          const newExpensesDay = new ExpensesDay({
            userExpense: createdExpensesUser.id,
            createdDate: `${year}-${month}-${day}`,
          });
          await newExpensesDay.save();
        }
      }
    }
    console.log("User Daily Expenses Created Successfully");
  } catch (error) {
    console.error(error);
  }
});
