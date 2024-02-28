const Motivation = require("../models/motivation");

const createMotivation = async (req, res) => {
  try {
    const newMotivation = new Motivation({
      ...req.body,
    });

    const createdMotivation = await newMotivation.save();

    res.status(201).json(createdMotivation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Motivation" });
  }
};

module.exports = {
  createMotivation,
};
