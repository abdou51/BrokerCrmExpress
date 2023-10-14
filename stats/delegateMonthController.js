const Visit = require("../models/visit");
const Goal = require("../models/goal");

const planDeTournee = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = req.query.year;
    const month = req.query.month;

    const monthYear = new RegExp(`^${year}-${month}`);

    const totalVisitsCount = await Visit.countDocuments({
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
    });

    const doneVisitsCount = await Visit.countDocuments({
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
      isDone: true,
    });

    const percentage = (doneVisitsCount / totalVisitsCount) * 100;

    res.status(200).json({ percentage });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};

const moyenneVisitesParJour = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = req.query.year;
    const month = req.query.month;

    const monthYear = new RegExp(`^${year}-${month}`);
    const uniqueDaysWithVisitsCount = await Visit.distinct("visitDate", {
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
    });

    const numberOfDaysWithVisits = uniqueDaysWithVisitsCount.length;
    const totalVisitsCount = await Visit.countDocuments({
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
    });

    res.status(200).json({
      moyenneVisitesParJour: totalVisitsCount / numberOfDaysWithVisits,
    });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};

const objectifVisites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = req.query.year;
    const month = req.query.month;
    let objectifVisites;

    const monthYear = new RegExp(`^${year}-${month}`);
    const visits = await Visit.find({
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
    });
    const goal = await Goal.findOne({
      user: userId,
      date: {
        $regex: monthYear,
      },
    });
    if (!goal) {
      objectifVisites = 0;
    } else {
      objectifVisites = (visits.length / goal.totalVisits) * 100;
      objectifVisites = objectifVisites.toFixed(2);
    }

    res.status(200).json({ objectifVisites: objectifVisites });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};
const objectifChiffreDaffaire = async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = req.query.year;
    const month = req.query.month;
    let objectifChiffreDaffaire;

    const monthYear = new RegExp(`^${year}-${month}`);
    const visits = await Visit.find({
      hasCommand: true,
      user: userId,
      visitDate: {
        $regex: monthYear,
      },
    }).populate("command");
    const totalRemisedSum = visits.reduce(
      (sum, visit) => sum + visit.command.totalRemised,
      0
    );
    console.log(totalRemisedSum);
    const goal = await Goal.findOne({
      user: userId,
      date: {
        $regex: monthYear,
      },
    });
    if (!goal) {
      objectifChiffreDaffaire = 0;
    } else {
      objectifChiffreDaffaire = (totalRemisedSum / goal.totalSales) * 100;
      objectifChiffreDaffaire = objectifChiffreDaffaire.toFixed(2);
    }

    res.status(200).json({ objectifChiffreDaffaire: objectifChiffreDaffaire });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.log(error);
  }
};

module.exports = {
  planDeTournee,
  moyenneVisitesParJour,
  objectifVisites,
  objectifChiffreDaffaire,
};
