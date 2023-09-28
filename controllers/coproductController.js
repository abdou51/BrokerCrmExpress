const Coproduct = require("../models/coproduct");

const createCoproduct = async (req, res) => {
  try {
    const coproductData = { ...req.body };
    const createdCoproduct = await Coproduct.create(coproductData);

    res.status(201).json(createdCoproduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating Coproduct" });
    console.log(error);
  }
};

module.exports = {
  createCoproduct,
};
