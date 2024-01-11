const mongoose = require("mongoose");
const Agenda = require("agenda");

// Import your models
const ExpensesUser = require("../models/expensesUser");
const ExpensesDay = require("../models/expensesDay");
const User = require("../models/user");
const ExpensesConfig = require("../models/expensesConfig");
const Goal = require("../models/goal");

// MongoDB connection string
const mongoConnectionString =
  "mongodb+srv://nilzak:GQzGlcImK9Q1pCOg@cluster0.r0wz1hb.mongodb.net/agenda"; // Replace with your MongoDB URI

// Initialize Agenda
const agenda = new Agenda({ db: { address: mongoConnectionString } });

// Define the job
agenda.define("update goals and expenses", async (job) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const users = await User.find();
    const expensesConfig = await ExpensesConfig.findOne();

    for (const user of users) {
      if (user.role !== "Admin" && user.role !== "Supervisor") {
        // Logic for Goal
        await Goal.findOneAndUpdate(
          {
            user: user._id,
            createdAt: {
              $gte: firstDayOfMonth,
            },
          },
          {
            $setOnInsert: {
              user: user._id,
              totalSales: 0,
              totalVisits: 0,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        // Logic for ExpensesUser
        await ExpensesUser.findOneAndUpdate(
          {
            user: user._id,
            createdAt: {
              $gte: firstDayOfMonth,
            },
          },
          {
            $setOnInsert: {
              user: user._id,
              expensesConfig: expensesConfig._id,
              total: 0,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        // Logic for ExpensesDay
        await ExpensesDay.findOneAndUpdate(
          {
            user: user._id,
            createdAt: {
              $gte: startOfDay,
            },
          },
          {
            $setOnInsert: {
              user: user._id,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
      }
    }
    console.log("User daily expenses and goals updated successfully");
  } catch (error) {
    console.error("Error in agenda job:", error);
  }
});

// Schedule the job to run every day at midnight
async function runAgendaJobs() {
  await agenda.start();
  agenda.every("*/10 * * * * *", "update goals and expenses");
}

runAgendaJobs().catch((error) => console.error(error));

// Graceful shutdown
function gracefulShutdown() {
  agenda.stop(() => process.exit(0));
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = { runAgendaJobs };
