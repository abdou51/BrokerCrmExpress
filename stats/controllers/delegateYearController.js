const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const planDeTournee = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;

    let monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      doneVisits: 0,
      allVisits: 0,
    }));

    const results = await Visit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
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
      {
        $sort: { _id: 1 },
      },
    ]);

    results.forEach((item) => {
      const monthIndex = item._id - 1;
      monthlyStats[monthIndex].doneVisits = item.doneVisits;
      monthlyStats[monthIndex].allVisits = item.allVisits;
    });

    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};
const tauxDeReussite = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;

    let monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      doneVisits: 0,
      honoredCommands: 0,
    }));

    const doneVisitsAggregation = await Visit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          visitDate: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
          state: "Done",
        },
      },
      {
        $group: {
          _id: { $month: "$visitDate" },
          count: { $sum: 1 },
        },
      },
    ]);
    const honoredCommandsAggregation = await Command.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
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
          count: { $sum: 1 },
        },
      },
    ]);
    doneVisitsAggregation.forEach((item) => {
      monthlyStats[item._id - 1].doneVisits = item.count;
    });

    honoredCommandsAggregation.forEach((item) => {
      monthlyStats[item._id - 1].honoredCommands = item.count;
    });

    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: "Error in processing request" });
    console.error(error);
  }
};
const contributionChiffreDaffaireAnnuel = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userTotalRemised = await Command.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          commandDate: { $gte: start, $lte: end },
          isHonored: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRemised: { $sum: "$totalRemised" },
        },
      },
    ]);

    const teammateIds = await User.find({
      createdBy: user.createdBy,
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
    }).select("_id");
    const teammateUserIds = teammateIds.map((teammate) => teammate._id);

    const teammateTotalRemised = await Command.aggregate([
      {
        $match: {
          user: { $in: teammateUserIds },
          commandDate: { $gte: start, $lte: end },
          isHonored: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRemised: { $sum: "$totalRemised" },
        },
      },
    ]);

    let totalUserRemised = 0;
    if (userTotalRemised.length > 0) {
      totalUserRemised = userTotalRemised[0].totalRemised;
    }

    let totalTeammateRemised = 0;
    if (teammateTotalRemised.length > 0) {
      totalTeammateRemised = teammateTotalRemised[0].totalRemised;
    }

    res.status(200).json({
      user: totalUserRemised,
      team: totalTeammateRemised,
    });
  } catch (error) {
    res.status(500).json({ error: "Error in processing request" });
    console.error(error);
  }
};

module.exports = {
  planDeTournee,
  tauxDeReussite,
  contributionChiffreDaffaireAnnuel,
};
