const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("../models/user");
const ExpensesUser = require("../models/expensesUser");
const Goal = require("../models/goal");
const ExpensesDay = require("../models/expensesDay");
const Visit = require("../models/visit");
const Client = require("../models/client");

async function calculateVisitsByClientType(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const visits = await Visit.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        visitDate: { $gte: startOfDay, $lte: endOfDay },
        state: "Done",
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "clientData",
      },
    },
    { $unwind: "$clientData" },
    {
      $group: {
        _id: "$clientData.type",
        count: { $sum: 1 },
      },
    },
  ]);

  return visits.reduce(
    (acc, visit) => {
      acc[visit._id] = visit.count;
      return acc;
    },
    { Doctor: 0, Pharmacy: 0, Wholesaler: 0 }
  );
}

// schedule every 24 hours : 0 0 * * *
// Daily cron job
cron.schedule("0 0 * * *", async () => {
  try {
    const users = await User.find({
      role: { $nin: ["Admin", "Supervisor", "Operator"] },
    });
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const startOfMonth = new Date(year, month, 1);
    const startOfToday = new Date(year, month, today.getDate());

    for (const user of users) {
      await ExpensesUser.findOneAndUpdate(
        { user: user.id, createdAt: { $gte: startOfMonth } },
        {
          $setOnInsert: {},
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      await Goal.findOneAndUpdate(
        { user: user.id, createdAt: { $gte: startOfMonth } },
        {
          $setOnInsert: {},
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      // Create ExpensesDay for today
      const expense = await ExpensesDay.findOneAndUpdate(
        { user: user.id, date: startOfToday },
        {
          $setOnInsert: {},
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
      console.log(expense);
      for (
        let day = startOfMonth.getDate();
        day < startOfToday.getDate();
        day++
      ) {
        const pastDate = new Date(year, month, day);
        const expensesDay = await ExpensesDay.findOneAndUpdate(
          { user: user.id, date: pastDate },
          {
            $setOnInsert: {
              /* default values */
            },
          },
          { upsert: true, setDefaultsOnInsert: true, new: true }
        );
        // If the document was newly created, calculate visits
        if (expensesDay && !expensesDay.visitsCalculated) {
          const visitCounts = await calculateVisitsByClientType(
            user.id,
            pastDate
          );
          expensesDay.totalVisitsDoctor = visitCounts.Doctor;
          expensesDay.totalVisitsPharmacy = visitCounts.Pharmacy;
          expensesDay.totalVisitsWholesaler = visitCounts.Wholesaler;
          await expensesDay.save();
        }
      }
    }
    console.log(
      "Daily Document Creation and Verification Completed Successfully"
    );
  } catch (error) {
    console.error(error);
  }
});
