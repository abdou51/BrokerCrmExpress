const Rapport = require("../models/rapport");
const Visit = require("../models/visit");

const createRapport = async (req, res) => {
  try {
    const { visit, note, products, coproducts, suppliers, comments } = req.body;

    const userId = req.user.userId;
    const visitTask = await Visit.findById(visit).populate("task");

    if (!visitTask || visitTask.task.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Rapport for this task.",
      });
    }

    const newRapport = new Rapport({
      visit,
      note,
      products,
      coproducts,
      suppliers,
      comments,
    });

    const createdRapport = await newRapport.save();

    res.status(201).json(createdRapport);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the Rapport." });
    console.log(error);
  }
};
const getRapportById = async (req, res) => {
  try {
    const rapportId = req.params.id;

    const rapport = await Rapport.findById(rapportId)
      .populate({
        path: "visit",
        populate: {
          path: "task",
          select: "-user",
          populate: [{ path: "client" }],
        },
      })
      .populate("comments")
      .populate({
        path: "products.product",
        model: "Product", // Make sure to specify the model name here
      })
      .populate({
        path: "coproducts.coproduct",
        model: "Coproduct", // Specify the model name for coproducts
      })
      .populate({
        path: "suppliers",
        model: "Supplier", // Specify the model name for suppliers
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
    const { note, products, coproducts, suppliers, comments } = req.body;
    const rapportId = req.params.id; // Assuming you pass the Rapport ID in the request parameters

    // Find the existing Rapport by its ID
    const existingRapport = await Rapport.findById(rapportId).populate({
      path: "visit",
      populate: {
        path: "task",
        model: "Task",
      },
    });
    console.log(existingRapport.visit.task.user);
    if (!existingRapport) {
      return res.status(404).json({
        error: "Rapport not found.",
      });
    }

    const userId = req.user.userId;
    if (
      existingRapport.visit &&
      existingRapport.visit.task.user.toString() !== userId
    ) {
      return res.status(403).json({
        error: "You are not allowed to edit this Rapport.",
      });
    }

    // Update the Rapport fields
    existingRapport.note = note;
    existingRapport.products = products;
    existingRapport.coproducts = coproducts;
    existingRapport.suppliers = suppliers;
    existingRapport.comments = comments;

    // Save the updated Rapport
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
