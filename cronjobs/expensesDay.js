const ExpensesUser = require("../models/expensesUser");
const ExpensesDay = require("../models/expensesDay");
const User = require("../models/user");
const cron = require("node-cron");
const ExpensesConfig = require("../models/expensesConfig");
const Goal = require("../models/goal");

cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  try {
    const users = await User.find();
    const expensesConfig = await ExpensesConfig.findOne();

    for (const user of users) {
      if (user.role !== "Admin" && user.role !== "Supervisor") {
        await Goal.findOneAndUpdate(
          {
            user: user.id,
            createdAt: {
              $gte: firstDayOfMonth,
            },
          },
          {
            $setOnInsert: {
              user: user.id,
              totalSales: 0,
              totalVisits: 0,
            },
          },
          {
            new: true, // Return the modified document rather than the original
            upsert: true, // Create the document if it doesn't exist
            setDefaultsOnInsert: true, // Apply the schema defaults if a new document is created
          }
        );
        await ExpensesUser.findOneAndUpdate(
          {
            user: user.id,
            createdAt: {
              $gte: firstDayOfMonth,
            },
          },
          {
            $setOnInsert: {
              user: user.id,
              expensesConfig: expensesConfig.id,
              total: 0,
            },
          },
          {
            new: true, // Return the modified document rather than the original
            upsert: true, // Create the document if it doesn't exist
            setDefaultsOnInsert: true, // Apply the schema defaults if a new document is created
          }
        );
        await ExpensesDay.findOneAndUpdate(
          {
            user: user.id,
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
          {
            $setOnInsert: {
              user: user.id,
            },
          },
          {
            new: true, // Return the modified document rather than the original
            upsert: true, // Create the document if it doesn't exist
            setDefaultsOnInsert: true, // Apply the schema defaults if a new document is created
          }
        );
      }
    }
    console.log("User Daily Expenses Created Successfully");
  } catch (error) {
    console.error(error);
  }
});
