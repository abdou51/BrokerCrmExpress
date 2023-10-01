const Rapport = require("../models/rapport");
const Visit = require("../models/visit");
const Client = require("../models/client");
const ExpensesDay = require("../models/expensesDay");
const ExpensesUser = require("../models/expensesUser");

const createRapport = async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}`;
  try {
    const { visit, note, objectif, products, suppliers, comments } = req.body;

    const userId = req.user.userId;
    const userVisit = await Visit.findById(visit).populate("client");

    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Rapport for this Visit.",
      });
    }
    if (userVisit.isDone == true) {
      return res.status(400).json({
        error: "A Rapport already exists for this visit.",
      });
    }
    if (req.body.client) {
      const updatedClientData = req.body.client;
      await Client.findByIdAndUpdate(userVisit.client, updatedClientData);
    }

    const newRapport = new Rapport({
      visit,
      note,
      objectif,
      products,
      suppliers,
      comments,
    });

    const createdRapport = await newRapport.save();
    userVisit.isDone = true;
    userVisit.rapport = createdRapport;

    await userVisit.save();
    const expensesUser = await ExpensesUser.findOne({
      user: userId,
      createdDate: formattedDate,
    });
    let update = {};

    if (userVisit.client.domainType === "doctor") {
      update = { $inc: { totalVisitsDoctor: 1 } };
    } else if (userVisit.client.domainType === "pharmacy") {
      update = { $inc: { totalVisitsPharmacy: 1 } };
    } else if (userVisit.client.domainType === "wholesaler") {
      update = { $inc: { totalVisitsWholesaler: 1 } };
    }

    const updatedExpensesDay = await ExpensesDay.findOneAndUpdate(
      {
        userExpense: expensesUser.id,
        createdDate: `${year}-${month}-${day}`,
      },
      update,
      {
        new: true,
      }
    );
    console.log(updatedExpensesDay);
    res.status(200).json(createdRapport);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the Rapport." });
    console.error(error);
  }
};

const getRapportById = async (req, res) => {
  try {
    const rapportId = req.params.id;

    const rapport = await Rapport.findById(rapportId)
      .populate({
        path: "visit",
        populate: [
          {
            path: "client",
            model: "Client",
          },
          {
            path: "user",
            model: "User",
            select: "-passwordHash -createdBy -wilayas -portfolio",
          },
        ],
      })
      .populate("comments")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "suppliers",
        model: "Supplier",
      });

    if (!rapport) {
      return res.status(404).json({ error: "Rapport not found." });
    }

    res.status(200).json(rapport);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the Rapport." });
    console.log(error);
  }
};

const updateRapport = async (req, res) => {
  try {
    const { visit, note, objectif, products, suppliers, comments } = req.body;
    const rapportId = req.params.id;

    const existingRapport = await Rapport.findById(rapportId).populate({
      path: "visit",
    });
    if (!existingRapport) {
      return res.status(404).json({
        error: "Rapport not found.",
      });
    }
    if (visit.client) {
      await Client.findByIdAndUpdate(
        existingRapport.visit.client,
        visit.client,
        {
          new: true,
        }
      );
    }
    existingRapport.objectif = objectif;
    existingRapport.note = note;
    existingRapport.products = products;
    existingRapport.suppliers = suppliers;
    existingRapport.comments = comments;
    const updatedRapport = await existingRapport.save();
    res.status(200).json(updatedRapport);
  } catch (error) {
    res.status(400).json({ error: "Failed to edit the Rapport." });
    console.log(error);
  }
};

module.exports = {
  createRapport,
  getRapportById,
  updateRapport,
};
