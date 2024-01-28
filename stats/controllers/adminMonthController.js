const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const classementChiffreDaffaireSupervisors = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const year = req.body.year;
    const month = req.body.month - 1;
    const isHonored = req.body.isHonored;

    if (year === undefined || month === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const supervisors = await User.find({
      createdBy: adminId,
      role: "Supervisor",
    });

    let supervisorHonoredSums = [];

    for (const supervisor of supervisors) {
      const delegates = await User.find({ createdBy: supervisor._id });
      let supervisorHonoredSum = 0;

      for (const delegate of delegates) {
        const visits = await Visit.aggregate([
          {
            $match: {
              user: delegate._id,
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

        if (visits.length > 0) {
          const visitIds = visits[0].visitIds;

          const matchCondition = {
            visit: { $in: visitIds },
            ...(isHonored === true ? { isHonored: true } : {}),
          };

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
            supervisorHonoredSum += commandResults[0].totalRemised;
          }
        }
      }

      supervisorHonoredSums.push({
        supervisorId: supervisor._id,
        fullName: supervisor.fullName,
        honoredSum: supervisorHonoredSum,
      });
    }

    // Sorting and calculating the rank
    supervisorHonoredSums.sort((a, b) => b.honoredSum - a.honoredSum);

    // Calculating total honored sum of all supervisors
    const totalHonoredSum = supervisorHonoredSums.reduce(
      (acc, curr) => acc + curr.honoredSum,
      0
    );

    // Adding rank and percentage
    supervisorHonoredSums = supervisorHonoredSums.map((supervisor, index) => ({
      rank: index + 1,
      supervisorId: supervisor.supervisorId,
      name: supervisor.fullName,
      total: supervisor.honoredSum,
      percentage:
        totalHonoredSum > 0
          ? +((supervisor.honoredSum / totalHonoredSum) * 100).toFixed(2)
          : 0,
    }));

    res.status(200).json(supervisorHonoredSums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  classementChiffreDaffaireSupervisors,
};
