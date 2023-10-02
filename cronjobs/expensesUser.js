// const cron = require("node-cron");
// const User = require("../models/user");
// const ExpensesConfig = require("../models/expensesConfig");
// const ExpensesUser = require("../models/expensesUser");

// // Schedule a task to run every minute
// cron.schedule("0 0 1 * *", async () => {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
//   const formattedDate = `${year}-${month}`;

//   try {
//     const users = await User.find();
//     const expensesConfig = await ExpensesConfig.findOne();

//     for (const user of users) {
//       if (user.role !== "Admin" && user.role !== "Supervisor") {
//         const createdExpensesUser = await ExpensesUser.create({
//           user: user.id,
//           expensesConfig: expensesConfig.id,
//           createdDate: formattedDate,
//         });
//       }
//     }
//     console.log("User Expenses Created Successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });
