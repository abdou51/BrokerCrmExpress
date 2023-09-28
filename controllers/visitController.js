const Visit = require("../models/visit");

const createVisit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { visitLocation, visitDate, client } = req.body;

    const newVisit = new Visit({
      user: userId,
      visitLocation,
      visitDate,
      client,
    });

    const createdVisit = await newVisit.save();

    res.status(201).json(createdVisit);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the Visit." });
    console.log(error);
  }
};

module.exports = {
  createVisit,
};
