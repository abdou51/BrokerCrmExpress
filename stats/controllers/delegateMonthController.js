const Visit = require("../../models/visit");
const Goal = require("../../models/goal");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Command = require("../../models/command");

const planDeTournee = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

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

    let percentage = 0;
    if (totalVisits > 0) {
      percentage = (doneVisits / totalVisits) * 100;
    }

    res.status(200).json({ result: +percentage.toFixed(2) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

const moyenneVisitesParJour = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const uniqueDaysWithVisitsCount = await Visit.distinct("visitDate", {
      user: userId,
      visitDate: { $gte: start, $lte: end },
      state: "Done",
    });

    const numberOfDaysWithVisits = uniqueDaysWithVisitsCount.length;

    const totalVisitsCount = await Visit.countDocuments({
      user: userId,
      visitDate: { $gte: start, $lte: end },
      state: "Done",
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
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    // Counting Done Visits
    const doneVisits = await Visit.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      visitDate: { $gte: start, $lte: end },
      state: "Done",
    });

    // Counting Honored Commands
    const honoredCommandsCount = await Command.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      commandDate: { $gte: start, $lte: end },
      isHonored: true,
    });

    const percentage =
      doneVisits > 0
        ? +((honoredCommandsCount / doneVisits) * 100).toFixed(2)
        : 0;

    res.status(200).json({ result: percentage });
  } catch (error) {
    res.status(500).json({ error: "Error" });
    console.error(error);
  }
};
const couverturePortefeuilleClient = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

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
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

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
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;

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

const delegateChiffreDaffaireStats = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;
    if (userId === undefined || year === undefined || month === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          commandDate: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: "$isHonored",
          totalRemisedSum: { $sum: "$totalRemised" },
        },
      },
    ];

    const result = await Command.aggregate(pipeline);

    let totalHonored = 0;
    let totalNonHonored = 0;
    let totalCombined = 0;

    result.forEach((item) => {
      if (item._id) {
        totalHonored += item.totalRemisedSum;
      } else {
        totalNonHonored += item.totalRemisedSum;
      }
      totalCombined += item.totalRemisedSum;
    });

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

const venteParProduit = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const isHonored = req.query.isHonored === "true";
    const orders = await Command.find({
      user: userId,
      commandDate: { $gte: start, $lte: end },
      ...(isHonored === true ? { isHonored: true } : {}),
    })
      .populate({ path: "products.product", select: "name" })
      .select("remise products.quantity products.total");
    const productSales = orders.reduce((acc, order) => {
      order.products.forEach(({ product, quantity, total }) => {
        if (!acc[product._id]) {
          acc[product._id] = { name: product.name, quantity: 0, total: 0 };
        }
        const adjustedTotal = total - (total * order.remise) / 100;
        acc[product._id].quantity += quantity;
        acc[product._id].total += adjustedTotal;
      });
      return acc;
    }, {});
    const productsArray = Object.values(productSales);
    const totalSales = productsArray.reduce(
      (acc, product) => acc + product.total,
      0
    );
    productsArray.forEach((product) => {
      product.percentage = +((product.total / totalSales) * 100).toFixed(2);
    });
    const rankedProducts = productsArray.sort((a, b) => b.total - a.total);
    res.status(200).json(rankedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};
const venteParWilaya = async (req, res) => {
  try {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month - 1;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const isHonored = req.query.isHonored === "true";
    const orders = await Command.find({
      user: userId,
      commandDate: { $gte: start, $lte: end },
      ...(isHonored === true ? { isHonored: true } : {}),
    })
      .populate({
        path: "visit",
        select: "client",
        populate: [
          { path: "client", select: "wilaya", populate: { path: "wilaya" } },
        ],
      })
      .populate({ path: "products.product", select: "name" })
      .select("remise products.quantity products.total");
    const salesByWilaya = orders.reduce((acc, order) => {
      const wilayaId = order.visit.client.wilaya._id;
      const wilayaName = order.visit.client.wilaya.name;
      if (!acc[wilayaId]) {
        acc[wilayaId] = { name: wilayaName, products: {} };
      }

      order.products.forEach(({ product, quantity, total }) => {
        if (!acc[wilayaId].products[product._id]) {
          acc[wilayaId].products[product._id] = {
            name: product.name,
            quantity: 0,
            total: 0,
          };
        }
        const adjustedTotal = total - (total * order.remise) / 100;
        acc[wilayaId].products[product._id].quantity += quantity;
        acc[wilayaId].products[product._id].total += adjustedTotal;
      });

      return acc;
    }, {});

    // Convert aggregated data into a structured format, calculate percentages, and rank
    const rankedSalesByWilaya = Object.entries(salesByWilaya).map(
      ([, { name, products }]) => {
        const productsArray = Object.values(products);
        const totalSales = productsArray.reduce(
          (acc, product) => acc + product.total,
          0
        );

        // Calculate percentage of total sales for each product
        productsArray.forEach((product) => {
          product.percentage = +((product.total / totalSales) * 100).toFixed(2);
        });

        // Rank products
        const rankedProducts = productsArray.sort((a, b) => b.total - a.total);

        return {
          name,
          totalSales,
          products: rankedProducts,
        };
      }
    );
    res.status(200).json(rankedSalesByWilaya);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  planDeTournee,
  moyenneVisitesParJour,
  tauxDeReussite,
  couverturePortefeuilleClient,
  objectifVisites,
  objectifChiffreDaffaire,
  delegateChiffreDaffaireStats,
  venteParProduit,
  venteParWilaya,
};
