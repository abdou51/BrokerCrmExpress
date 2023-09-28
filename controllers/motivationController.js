const Motivation = require("../models/motivation");

const createMotivation = async (req, res) => {
  try {
    const newMotivation = new Motivation({
      motivation: req.body.motivation,
    });

    const createdMotivation = await newMotivation.save();

    res.status(201).json(createdMotivation);
  } catch (error) {
    res.status(500).json({ error: "Error creating Motivation" });
    console.error(error);
  }
};

module.exports = {
  createMotivation,
};
