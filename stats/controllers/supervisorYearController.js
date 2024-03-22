const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const yearlyStats = async (req, res) => {
  try {
    let supervisorId;
    if (["Admin", "Operator"].includes(req.user.role)) {
      supervisorId = req.query.supervisorId;
    } else if (req.user.role === "Supervisor") {
      supervisorId = req.user.userId;
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const user = await User.findById(supervisorId);
    if (!user || user.role !== "Supervisor") {
      return res.status(400).json({ error: "Invalid supervisor ID" });
    }
    const year = parseInt(req.query.year, 10);
    const userDocuments = await User.find({ createdBy: supervisorId }).select(
      "_id"
    );
    console.log(supervisorId);
    const userIds = userDocuments.map((doc) => doc._id);
    let monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      doneVisits: 0,
      allVisits: 0,
      honoredCommands: 0,
      totalRemised: 0,
      totalSales: 0,
      totalVisits: 0,
    }));

    const visitAggregation = Visit.aggregate([
      {
        $match: {
          user: { $in: userIds }, // Use $in operator to match any user ID in the userIds array
          visitDate: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $project: {
          month: { $month: "$visitDate" },
          isDone: {
            $cond: { if: { $eq: ["$state", "Done"] }, then: 1, else: 0 },
          },
        },
      },
      {
        $group: {
          _id: "$month",
          doneVisits: { $sum: "$isDone" },
          allVisits: { $sum: 1 },
        },
      },
    ]);

    const commandAggregation = Command.aggregate([
      {
        $match: {
          user: { $in: userIds },
          commandDate: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
          isHonored: true,
        },
      },
      {
        $group: {
          _id: { $month: "$commandDate" },
          honoredCommands: { $sum: 1 },
          totalRemised: { $sum: "$totalRemised" },
        },
      },
    ]);

    const goalAggregation = Goal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(supervisorId),
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          totalSales: { $sum: "$totalSales" },
          totalVisits: { $sum: "$totalVisits" },
        },
      },
    ]);
    const [visitResults, commandResults, goalResults] = await Promise.all([
      visitAggregation,
      commandAggregation,
      goalAggregation,
    ]);
    visitResults.forEach((item) => {
      const monthIndex = item._id - 1;
      monthlyStats[monthIndex].doneVisits = item.doneVisits;
      monthlyStats[monthIndex].allVisits = item.allVisits;
    });

    commandResults.forEach((item) => {
      const monthIndex = item._id - 1;
      monthlyStats[monthIndex].honoredCommands = item.honoredCommands;
      monthlyStats[monthIndex].totalRemised = item.totalRemised;
    });
    goalResults.forEach((item) => {
      const monthIndex = item._id - 1;
      monthlyStats[monthIndex].totalSales = item.totalSales;
      monthlyStats[monthIndex].totalVisits = item.totalVisits;
    });

    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: "Error in processing request" });
    console.error(error);
  }
};

const contributionChiffreDaffaireAnnuel = async (req, res) => {
  try {
    const { supervisorId, year, isHonored } = req.body;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const users = await User.find({ createdBy: supervisorId }, "fullName");

    let results = [];
    let highestTotal = 0;

    for (const user of users) {
      let match = {
        user: user._id,
        commandDate: { $gte: startDate, $lt: endDate },
      };

      if (typeof isHonored !== "undefined") {
        match.isHonored = isHonored;
      }
      const commandTotal = await Command.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$totalRemised" } } },
      ]);

      let total = commandTotal.length > 0 ? commandTotal[0].total : 0;
      highestTotal = total > highestTotal ? total : highestTotal;

      results.push({
        userId: user._id.toString(),
        fullName: user.fullName,
        total,
      });
    }
    results = results
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        percentage:
          highestTotal > 0
            ? +((item.total / highestTotal) * 100).toFixed(2).toString()
            : 0,
      }))
      .sort((a, b) => b.total - a.total);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  yearlyStats,
  contributionChiffreDaffaireAnnuel,
};
