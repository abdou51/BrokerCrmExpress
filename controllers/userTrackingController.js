const UserTracking = require("../models/userTracking");

const createUserTracking = async (req, res) => {
  try {
    const userTracking = new UserTracking({
      user: req.user.userId,
      ...req.body,
    });

    const createdUserTracking = await userTracking.save();

    res.status(201).json(createdUserTracking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating UserTracking" });
  }
};

module.exports = {
  createUserTracking,
};
