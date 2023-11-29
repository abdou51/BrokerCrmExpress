const Wilaya = require("../models/wilaya");

const createWilaya = async (req, res) => {
  try {
    const newWilaya = new Wilaya({
      name: req.body.name,
    });

    const createdWilaya = await newWilaya.save();

    res.status(201).json(createdWilaya);
  } catch (error) {
    res.status(500).json({ error: "Error creating Wilaya" });
  }
};

module.exports = {
  createWilaya,
};
