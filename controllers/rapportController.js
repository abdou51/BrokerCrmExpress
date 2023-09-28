const Rapport = require("../models/rapport");
const Visit = require("../models/visit");
const Client = require("../models/client");
const createRapport = async (req, res) => {
  try {
    const { visit, note, products, suppliers, comments } = req.body;

    const userId = req.user.userId;
    const userVisit = await Visit.findById(visit);

    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Rapport for this task.",
      });
    }
    if (req.body.client) {
      const updatedClientData = req.body.client;
      await Client.findByIdAndUpdate(userVisit.client, updatedClientData);
    }

    const newRapport = new Rapport({
      visit,
      note,
      products,
      suppliers,
      comments,
    });

    const createdRapport = await newRapport.save();

    res.status(201).json(createdRapport);
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
    const { visit, note, products, suppliers, comments } = req.body;
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
