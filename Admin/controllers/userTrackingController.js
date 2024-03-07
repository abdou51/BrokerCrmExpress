const UserTracking = require("../../models/userTracking");
const mongoose = require("mongoose");

const getTrackingPerDay = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const user = req.query.user;
    console.log(user);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    console.log(startOfDay, endOfDay);
    const trackings = await UserTracking.find({
      user: new mongoose.Types.ObjectId(user),
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    res.status(200).json(trackings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting tracking per day" });
  }
};

module.exports = {
  getTrackingPerDay,
};
