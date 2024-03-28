const Visit = require("../../models/visit");
const User = require("../../models/user");
const Command = require("../../models/command");

const contributionChiffreDaffaireAnnuel = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (!req.query.year) {
      return res.status(400).json({ error: "Year is required" });
    }
    const year = parseInt(req.query.year, 10);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const supervisors = await User.find({ role: "Supervisor" });

    let supervisorTotals = [];

    for (const supervisor of supervisors) {
      const teamMembersDocuments = await User.find({
        createdBy: supervisor._id,
      }).select("_id");
      console.log(teamMembersDocuments);
      const teamMembersIds = teamMembersDocuments.map((doc) => doc._id);
      const commandTotal = await Command.aggregate([
        {
          $match: {
            user: { $in: teamMembersIds },
            commandDate: { $gte: startDate, $lt: endDate },
            isHonored: true,
          },
        },
        { $group: { _id: null, totalRemised: { $sum: "$totalRemised" } } },
      ]);
      console.log(commandTotal);
      const totalRemised =
        commandTotal.length > 0 ? commandTotal[0].totalRemised : 0;

      supervisorTotals.push({
        supervisorId: supervisor._id.toString(),
        fullName: supervisor.fullName,
        totalRemised,
      });
    }
    supervisorTotals.sort((a, b) => b.totalRemised - a.totalRemised);
    supervisorTotals = supervisorTotals.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    res.json(supervisorTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error });
  }
};

const yearlyStats = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (!req.query.year) {
      return res.status(400).json({ error: "Year is required" });
    }
    const year = parseInt(req.query.year, 10);
    let monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      doneVisits: 0,
      allVisits: 0,
      honoredCommands: 0,
      totalSales: 0,
    }));

    const visitAggregation = Visit.aggregate([
      {
        $match: {
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

    const [visitResults, commandResults] = await Promise.all([
      visitAggregation,
      commandAggregation,
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

    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: "Error in processing request" });
    console.error(error);
  }
};

module.exports = {
  contributionChiffreDaffaireAnnuel,
  yearlyStats,
};
