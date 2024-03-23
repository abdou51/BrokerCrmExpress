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
      totalSales: 0,
      goalSales: 0,
      goalVisits: 0,
    }));

    const visitAggregation = Visit.aggregate([
      {
        $match: {
          user: { $in: userIds },
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
      monthlyStats[monthIndex].totalSales = item.totalRemised;
    });
    goalResults.forEach((item) => {
      const monthIndex = item._id - 1;
      monthlyStats[monthIndex].goalSales = item.totalSales;
      monthlyStats[monthIndex].goalVisits = item.totalVisits;
    });

    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: "Error in processing request" });
    console.error(error);
  }
};

const contributionChiffreDaffaireAnnuel = async (req, res) => {
  try {
    let supervisorId;
    if (["Admin", "Operator"].includes(req.user.role)) {
      supervisorId = req.query.supervisorId;
    } else if (req.user.role === "Supervisor") {
      supervisorId = req.user.userId;
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const year = parseInt(req.query.year, 10);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const users = await User.find({ createdBy: supervisorId }, "fullName");

    let results = [];
    let highestTotal = 0;

    for (const user of users) {
      let match = {
        user: user._id,
        commandDate: { $gte: startDate, $lt: endDate },
        isHonored: true,
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

const contributionEquipeAnnuel = async (req, res) => {
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

    const teamMembersDocuments = await User.find({
      createdBy: supervisorId,
    }).select("_id");

    const teamMembersIds = teamMembersDocuments.map((doc) => doc._id);
    const allMembersDocuments = await User.find({ role: "Delegate" }).select(
      "_id"
    );
    const allMembersIds = allMembersDocuments.map((doc) => doc._id);

    const calculateTotalRemised = async (userIds) => {
      const results = await Command.aggregate([
        {
          $match: {
            user: { $in: userIds },
            isHonored: true,
            commandDate: {
              $gte: new Date(year, 0, 1),
              $lt: new Date(year + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRemised: { $sum: "$totalRemised" },
          },
        },
      ]);
      return results.length > 0 ? results[0].totalRemised : 0;
    };

    const [totalRemisedTeamMembers, totalRemisedAllMembers] = await Promise.all(
      [
        calculateTotalRemised(teamMembersIds),
        calculateTotalRemised(allMembersIds),
      ]
    );

    res.status(200).json({
      teamsales: totalRemisedTeamMembers,
      allsales: totalRemisedAllMembers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  yearlyStats,
  contributionChiffreDaffaireAnnuel,
  contributionEquipeAnnuel,
};
