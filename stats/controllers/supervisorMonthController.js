const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const supervisorChiffreDaffaireStats = async (req, res) => {
  try {
    let supervisorId;
    if (["Admin", "Operator"].includes(req.user.role)) {
      supervisorId = req.query.supervisorId;
    } else if (req.user.role === "Supervisor") {
      supervisorId = req.user.userId;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const year = req.query.year;
    const month = req.query.month - 1;
    if (
      supervisorId === undefined ||
      year === undefined ||
      month === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const users = await User.find({ createdBy: supervisorId });
    let totalHonored = 0;
    let totalNonHonored = 0;
    let totalCombined = 0;

    for (const user of users) {
      // Aggregate visits for each user
      const visits = await Visit.aggregate([
        {
          $match: {
            user: user._id,
            visitDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            visitIds: { $push: "$_id" },
          },
        },
      ]);
      console.log(visits);
      if (visits.length > 0) {
        const visitIds = visits[0].visitIds;

        // Aggregate commands based on visits
        const commandResults = await Command.aggregate([
          {
            $match: {
              visit: { $in: visitIds },
            },
          },
          {
            $group: {
              _id: "$isHonored",
              totalRemised: { $sum: "$totalRemised" },
            },
          },
        ]);

        // Process results for each user
        let honoredTotal = 0;
        let nonHonoredTotal = 0;
        commandResults.forEach((result) => {
          if (result._id) {
            // If isHonored is true
            honoredTotal += result.totalRemised;
          } else {
            nonHonoredTotal += result.totalRemised;
          }
        });

        // Update the overall totals
        totalHonored += honoredTotal;
        totalNonHonored += nonHonoredTotal;
        totalCombined += honoredTotal + nonHonoredTotal;
      }
    }

    res.status(200).json({
      honored: totalHonored,
      nonHonored: totalNonHonored,
      total: totalCombined,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};
const classementChiffreDaffaireEquipe = async (req, res) => {
  try {
    let supervisorId;
    if (["Admin", "Operator"].includes(req.user.role)) {
      supervisorId = req.query.supervisorId;
    } else if (req.user.role === "Supervisor") {
      supervisorId = req.user.userId;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const year = req.query.year;
    const month = req.query.month - 1;
    const isHonored = req.query.isHonored === "true";
    if (
      supervisorId === undefined ||
      year === undefined ||
      month === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    let users;
    if (req.query.role === "Kam") {
      users = await User.find({ role: "Kam" });
    } else {
      users = await User.find({ createdBy: supervisorId });
    }

    let userHonoredSums = [];
    let totalHonoredSum = 0;

    for (const user of users) {
      const visits = await Visit.aggregate([
        {
          $match: {
            user: user._id,
            visitDate: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            visitIds: { $push: "$_id" },
          },
        },
      ]);

      let honoredSum = 0;
      if (visits.length > 0) {
        const visitIds = visits[0].visitIds;

        const matchCondition = {
          visit: { $in: visitIds },
          ...(isHonored === true ? { isHonored: true } : {}),
        };
        console.log(matchCondition);
        const commandResults = await Command.aggregate([
          {
            $match: matchCondition,
          },
          {
            $group: {
              _id: null,
              totalRemised: { $sum: "$totalRemised" },
            },
          },
        ]);

        if (commandResults.length > 0) {
          honoredSum = commandResults[0].totalRemised;
        }
      }

      userHonoredSums.push({
        userId: user._id,
        fullName: user.fullName,
        honoredSum,
      });
      totalHonoredSum += honoredSum;
    }

    // Sort users by honoredSum in descending order and calculate percentage
    userHonoredSums.sort((a, b) => b.honoredSum - a.honoredSum);
    userHonoredSums = userHonoredSums.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      fullName: user.fullName,
      total: user.honoredSum,
      percentage:
        totalHonoredSum > 0
          ? +((user.honoredSum / totalHonoredSum) * 100).toFixed(2)
          : 0,
    }));

    res.status(200).json(userHonoredSums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  supervisorChiffreDaffaireStats,
  classementChiffreDaffaireEquipe,
};
