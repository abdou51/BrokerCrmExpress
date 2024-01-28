const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const planDeTournee = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const totalVisits = await Visit.countDocuments({
      user: userId,
      visitDate: { $gte: start, $lte: end },
    });

    const doneVisits = await Visit.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      visitDate: { $gte: start, $lte: end },
      state: "Done",
    });

    const percentage = (doneVisits / totalVisits) * 100;

    res.status(200).json({ result: +percentage.toFixed(2) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

const moyenneVisitesParJour = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const uniqueDaysWithVisitsCount = await Visit.distinct("visitDate", {
      user: userId,
      visitDate: { $gte: start, $lte: end },
    });

    const numberOfDaysWithVisits = uniqueDaysWithVisitsCount.length;

    const totalVisitsCount = await Visit.countDocuments({
      user: userId,
      visitDate: { $gte: start, $lte: end },
    });

    res.status(200).json({
      result: +(totalVisitsCount / numberOfDaysWithVisits).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};

const tauxDeReussite = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    // Counting Done Visits
    const doneVisits = await Visit.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      visitDate: { $gte: start, $lte: end },
      state: "Done",
    });

    // Aggregation for counting visits with honored commands
    const honoredCommandsCount = await Visit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          visitDate: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "commands",
          localField: "_id",
          foreignField: "visit",
          as: "commands",
        },
      },
      { $unwind: "$commands" },
      { $match: { "commands.isHonored": true } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    let honoredCommandsVisits = 0;
    if (honoredCommandsCount.length > 0) {
      honoredCommandsVisits = honoredCommandsCount[0].count;
    }

    res.status(200).json({
      result: +((honoredCommandsVisits / doneVisits) * 100).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};
const couverturePortefeuilleClient = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const user = await User.findById(userId).populate("clients");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const clientIds = user.clients.map((client) => client._id);

    // Count the number of unique clients visited in the specified time frame
    const visitedClients = await Visit.aggregate([
      {
        $match: {
          client: { $in: clientIds },
          visitDate: { $gte: start, $lte: end },
          state: "Done",
        },
      },
      {
        $group: {
          _id: "$client",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    let visitedClientsCount = 0;
    if (visitedClients.length > 0) {
      visitedClientsCount = visitedClients[0].count;
    }

    // Calculate the percentage
    const totalClientsCount = clientIds.length;
    const percentage =
      totalClientsCount > 0
        ? (visitedClientsCount / totalClientsCount) * 100
        : 0;

    res.status(200).json({ result: +percentage.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};
const objectifVisites = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const doneVisitsCount = await Visit.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      visitDate: { $gte: start, $lte: end },
      state: "Done",
    });

    const goal = await Goal.findOne({
      user: new mongoose.Types.ObjectId(userId),
      goalDate: { $gte: start, $lte: end },
    });

    let totalVisitGoal = goal ? goal.totalVisits : 0;
    let percentageOfVisitGoalAchieved =
      totalVisitGoal > 0 ? (doneVisitsCount / totalVisitGoal) * 100 : 0;

    res.status(200).json({ result: +percentageOfVisitGoalAchieved.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};
const objectifChiffreDaffaire = async (req, res) => {
  try {
    const userId = req.body.userId;
    const year = req.body.year;
    const month = req.body.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    // Aggregate to sum the totalRemised for commands linked to visits
    const commandResult = await Visit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          visitDate: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "commands",
          localField: "_id",
          foreignField: "visit",
          as: "linkedCommands",
        },
      },
      { $unwind: "$linkedCommands" },
      {
        $group: {
          _id: null,
          totalRemised: { $sum: "$linkedCommands.totalRemised" },
        },
      },
    ]);

    let totalRemised = 0;
    if (commandResult.length > 0) {
      totalRemised = commandResult[0].totalRemised;
    }

    // Retrieve the sales goal for the user for the specified month and year
    const goal = await Goal.findOne({
      user: new mongoose.Types.ObjectId(userId),
      goalDate: { $gte: start, $lte: end },
    });

    let totalSalesGoal = goal ? goal.totalSales : 0;
    let percentageOfGoalAchieved =
      totalSalesGoal > 0 ? (totalRemised / totalSalesGoal) * 100 : 0;

    res.status(200).json({ result: +percentageOfGoalAchieved.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};

module.exports = {
  planDeTournee,
  moyenneVisitesParJour,
  tauxDeReussite,
  couverturePortefeuilleClient,
  objectifVisites,
  objectifChiffreDaffaire,
};
