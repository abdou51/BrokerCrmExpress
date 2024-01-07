const Wilaya = require("../models/wilaya");

const createWilaya = async (req, res) => {
  try {
    const newWilaya = new Wilaya({
      name: req.body.name,
    });

    const createdWilaya = await newWilaya.save();

    res.status(201).json(createdWilaya);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
const getWilayas = async (req, res) => {
  try {
    const wilayas = await Wilaya.find();

    res.status(200).json(wilayas);
  } catch (error) {
    res.status(500).json({ error: "Error getting Wilayas" });
    console.error(error);
  }
};

module.exports = {
  createWilaya,
  getWilayas,
};
