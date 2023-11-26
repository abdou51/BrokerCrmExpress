const Establishment = require("../models/establishment");

const createEstablishment = async (req, res) => {
  try {
    const establishmentData = { ...req.body };
    const newEstablishment = new Establishment(establishmentData);

    const createdEstablishment = await newEstablishment.save();

    res.status(201).json(createdEstablishment);
  } catch (error) {
    res.status(500).json({ error: "Error creating Establishment" });
    console.log(error);
  }
};

module.exports = {
  createEstablishment,
};
